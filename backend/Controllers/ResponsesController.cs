using JoblessAPI.Data;
using JoblessAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JoblessAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResponsesController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly EmailService _emailService;

        // Constructor to initialize dependencies
        public ResponsesController(
            AppDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            EmailService emailService
        )
        {
            db = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _emailService = emailService;
        }

        // GET: api/Responses/index
        // Retrieves all responses grouped by application for the authenticated user
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Response>>> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Fetch responses associated with the user's applications
            var responses = await db.Responses
                .Include(r => r.Application)
                .Where(r => r.Application != null && r.Application.UserId == userId)
                .ToListAsync();

            // Return NotFound if no responses exist
            if (responses == null || responses.Count == 0)
                return NotFound();

            // Group responses by application and include actions sorted by date
            var grouped = responses
                .GroupBy(r => r.ApplicationId)
                .Select(g => new
                {
                    ApplicationId = g.Key,
                    Application = g.First().Application,
                    Actions = g.OrderByDescending(r => r.Date)
                        .Select(r => new
                        {
                            r.Id,
                            r.Action,
                            r.Date,
                            r.Deadline
                        }).ToList()
                });

            return Ok(grouped);
        }

        // GET: api/Responses/show/{id}
        // Retrieves a specific response by ID for the authenticated user
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Response>> Show(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Fetch the response by ID and ensure it belongs to the user
            var response = await db.Responses
                .Include(r => r.Application)
                .FirstOrDefaultAsync(r => r.Id == id && r.Application != null && r.Application.UserId == userId);

            // Return NotFound if the response does not exist
            if (response == null)
                return NotFound();

            return Ok(response);
        }

        // POST: api/Responses/new
        // Creates a new response for an application
        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] Response response)
        {
            // Validate the request model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Ensure the application exists and belongs to the user
            if (response.ApplicationId != null)
            {
                var application = await db.Applications.FindAsync(response.ApplicationId);

                if (application == null || application.UserId != userId)
                {
                    return Unauthorized(new { Message = "You are not allowed to add a response to this application" });
                }
            }

            // Set the response date to the current UTC time
            response.Date = DateTime.UtcNow;

            // Add the response to the database
            db.Responses.Add(response);
            await db.SaveChangesAsync();

            // Return the created response
            return CreatedAtAction(nameof(Show), new { id = response.Id }, response);
        }

        // PUT: api/Responses/edit/{id}
        // Updates an existing response
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Response updatedResponse)
        {
            // Ensure the response ID matches the updated response ID
            if (id != updatedResponse.Id)
            {
                return BadRequest(new { Message = "Response Id mismatch" });
            }

            // Fetch the response by ID
            var response = await db.Responses
                .Include(r => r.Application)
                .FirstOrDefaultAsync(r => r.Id == id);

            // Return NotFound if the response does not exist
            if (response == null)
            {
                return NotFound(new { Message = "Response not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Ensure the response belongs to the user
            if (response.Application == null || response.Application.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to edit this response" });
            }

            // Update the response action and date
            response.Action = updatedResponse.Action;
            response.Date = DateTime.UtcNow;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while updating the response", Error = ex.Message });
            }

            return Ok(new { Message = "Response updated successfully" });
        }

        // DELETE: api/Responses/delete/{id}
        // Deletes a response by ID
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Fetch the response by ID
            var response = await db.Responses
                .Include(r => r.Application)
                .FirstOrDefaultAsync(r => r.Id == id);

            // Return NotFound if the response does not exist
            if (response == null)
            {
                return NotFound(new { Message = "Response not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Ensure the response belongs to the user
            if (response.Application == null || response.Application.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to delete this response" });
            }

            // Remove the response from the database
            db.Responses.Remove(response);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while deleting the response", Error = ex.Message });
            }

            return Ok(new { Message = "Response deleted successfully" });
        }

        // GET: api/Responses/history/{applicationId}
        // Retrieves the history of responses for a specific application
        [HttpGet("history/{applicationId}")]
        public async Task<IActionResult> GetResponseHistory(int applicationId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Fetch the application and ensure it belongs to the user
            var application = await db.Applications
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == applicationId && a.UserId == userId);

            if (application == null)
            {
                return NotFound(new { Message = "Application not found or you are not authorized to view it" });
            }

            // Fetch responses for the application
            var responses = await db.Responses
                .Where(r => r.ApplicationId == applicationId)
                .ToListAsync();

            // Return NotFound if no responses exist
            if (responses == null)
            {
                return NotFound(new { Message = "No responses found for this application" });
            }

            // Return a message if no responses exist
            if (responses.Count == 0)
            {
                return Ok(new { Message = "No responses found for this application" });
            }

            // Sort responses by date in descending order
            responses = responses
                .OrderByDescending(r => r.Date)
                .ToList();

            return Ok(responses);
        }

        // POST: api/Responses/send-reminders
        // Sends email reminders for upcoming deadlines
        [HttpPost("send-reminders")]
        public async Task<IActionResult> SendEmailReminder()
        {
            var now = DateTime.UtcNow;
            var threeDaysFromNow = now.AddDays(3);

            // Fetch responses with deadlines within the next 3 days
            var responses = await db.Responses
                .Where(r => r.Deadline >= now && r.Deadline <= threeDaysFromNow)
                .Include(r => r.Application)
                .Include(r => r.Application.User)
                .ToListAsync();

            // Return a message if no reminders need to be sent
            if (responses.Count == 0)
            {
                return Ok(new { Message = "No reminders to send" });
            }

            // Send email reminders for each response
            foreach (var response in responses)
            {
                var user = response.Application.User;
                var email = user.Email;

                if (user != null && !string.IsNullOrEmpty(email))
                {
                    string subject = "Reminder: Upcoming Deadline";
                    string body = $@"
                        <html>
                            <body>
                                <p>Dear {user.FirstName},</p>
                                <p>This is a reminder that you have a deadline for your application on <strong>{response.Deadline.Value:dd MMM, yyyy}</strong>.</p>
                                <p>Please make sure to complete your action before the deadline.</p>
                                <br/>
                                <p>Best regards,<br>Jobless Team</p>
                            </body>
                        </html>";

                    await _emailService.SendEmailAsync(user.Email, subject, body);
                }
            }

            return Ok(new { Message = "All reminders have been sent!" });
        }

        // GET: api/Responses/stale-actions
        // Retrieves applications with stale actions (no updates for 28 days)
        [HttpGet("stale-actions")]
        public async Task<IActionResult> GetStaleActions()
        {
            try
            {
                var now = DateTime.UtcNow;
                var cutoffDate = now.AddDays(-28);

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Check if the user is authenticated
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { Message = "User not authenticated" });
                }

                // Fetch responses associated with the user's applications
                var responses = await db.Responses
                    .Include(r => r.Application)
                    .Where(r => r.Application != null && r.Application.UserId == userId)
                    .ToListAsync();

                // Identify stale applications based on the latest response date
                var latestResponses = responses
                    .GroupBy(r => r.ApplicationId)
                    .Select(g => g.OrderByDescending(r => r.Date).FirstOrDefault())
                    .Where(r =>
                        r != null &&
                        r.Date < cutoffDate &&
                        r.Action != Models.Action.Rejected &&
                        r.Action != Models.Action.Ghosted &&
                        r.Action != Models.Action.Accepted &&
                        r.Action != Models.Action.Cancelled &&
                        r.Application != null &&
                        r.Application.Status != Models.Status.Rejected &&
                        r.Application.Status != Models.Status.Accepted
                    )
                    .ToList();

                // Prepare a list of stale applications
                var staleApplications = latestResponses
                    .Select(r => new
                    {
                        r.Application.Id,
                        r.Application.JobTitle,
                        r.Application.Company,
                        LastResponseDate = r.Date,
                        LastAction = r.Action.ToString()
                    })
                    .ToList();

                // Return a message if no stale applications are found
                if (!staleApplications.Any())
                {
                    return Ok(new { Message = "No stale applications found", Items = new List<object>() });
                }

                return Ok(staleApplications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }
    }
}
using JoblessAPI.Data;
using JoblessAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
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
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Response>>> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var responses = await db.Responses
                .Include(r => r.Application)
                .Where(r => r.Application != null && r.Application.UserId == userId)
                .ToListAsync();

            if (responses == null || responses.Count == 0)
                return NotFound();

            var grouped = responses
            .GroupBy(r => r.ApplicationId)
            .Select(g => new
            {
                ApplicationId = g.Key,
                Application = g.First().Application,
                Actions = g.Select(r => new
                {
                    r.Id,
                    r.Action,
                    r.Date
                }).ToList()
            });

            return Ok(grouped);
        }

        // GET: api/Responses/show/{id}
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Response>> Show(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var response = await db.Responses
                .Include(r => r.Application)
                .FirstOrDefaultAsync(r => r.Id == id && r.Application != null && r.Application.UserId == userId);

            if (response == null)
                return NotFound();

            return Ok(response);
        }

        // POST: api/Responses/new
        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] Response response)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (response.ApplicationId != null)
            {
                var application = await db.Applications.FindAsync(response.ApplicationId);

                if (application == null || application.UserId != userId)
                {
                    return Unauthorized(new { Message = "You are not allowed to add a response to this application" });
                }
            }

            response.Date = DateTime.UtcNow;

            db.Responses.Add(response);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Show), new { id = response.Id }, response);
        }

        // PUT: api/Responses/edit/{id}
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Response updatedResponse)
        {
            if (id != updatedResponse.Id)
            {
                return BadRequest(new { Message = "Response Id mismatch" });
            }

            var response = await db.Responses
                .Include(r => r.Application)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (response == null)
            {
                return NotFound(new { Message = "Response not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (response.Application == null || response.Application.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to edit this response" });
            }

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
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await db.Responses
                .Include(r => r.Application)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (response == null)
            {
                return NotFound(new { Message = "Response not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (response.Application == null || response.Application.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to delete this response" });
            }

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

        // GET: api/Responses/history/{id}
        [HttpGet("history/{applicationId}")]
        public async Task<IActionResult> GetResponseHistory(int applicationId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var responses = await db.Responses
                .Where(r => r.ApplicationId == applicationId)
                .ToListAsync();

            if (responses == null || responses.Count == 0)
                return NotFound();

            responses = responses
                .OrderByDescending(r => r.Date)
                .ToList();

            return Ok(responses);
        }

        [HttpPost("send-reminders")]
        public async Task<IActionResult> SendEmailReminder()
        {

            var now = DateTime.UtcNow;
            var threeDaysFromNow = now.AddDays(3);

            // Get all responses with a deadline within the next 3 days
            var responses = await db.Responses
                .Where(r => r.Deadline >= now && r.Deadline <= threeDaysFromNow)
                .Include(r => r.Application)
                .Include(r => r.Application.User)
                .ToListAsync();

            if (responses.Count == 0)
            {
                return Ok(new { Message = "No reminders to send" });
            }

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
                
                                <p>This is a reminder that you have a deadline for your application on <strong>{response.Deadline.ToString("dd MMM, yyyy")}</strong>.</p>
                
                                <p>Please make sure to complete your action before the deadline.</p>
                
                                <br/>
                
                                <p>Best regards,<br>
                                Jobless Team</p>
                            </body>
                        </html>";

                    await _emailService.SendEmailAsync(user.Email, subject, body);
                }

            }

            return Ok(new { Message = "All reminders have been sent!" });

        }
    }
}

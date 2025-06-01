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
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IWebHostEnvironment _env;

        // Constructor to inject dependencies
        public ApplicationsController(
            AppDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IWebHostEnvironment env
        )
        {
            db = context; // Database context for accessing application data
            _userManager = userManager; // User manager for handling user-related operations
            _roleManager = roleManager; // Role manager for handling roles
            _env = env; // Environment for accessing server paths
        }

        // GET: api/Applications/index
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Application>>> Index()
        {
            // Retrieve the authenticated user's ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            // Fetch applications for the authenticated user
            var applications = await db.Applications
                .Include(a => a.Technologies) // Include related technologies
                .Include(a => a.User) // Include user details
                .Where(a => a.UserId == userId) // Filter by user ID
                .ToListAsync();

            if (applications == null || applications.Count == 0)
                return NotFound(); // Return 404 if no applications are found

            return Ok(applications); // Return the list of applications
        }

        // GET: api/Applications/show/{id}
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Application>> Show(int id)
        {
            // Retrieve the authenticated user's ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            // Fetch the application by ID and user ID
            var application = await db.Applications
                .Include(a => a.Technologies) // Include related technologies
                .Include(a => a.User) // Include user details
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (application == null)
                return NotFound(); // Return 404 if the application is not found

            return Ok(application); // Return the application details
        }

        // POST: api/Applications/new
        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] Application application)
        {
            // Retrieve the authenticated user's ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Validate the incoming model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(application.JobTitle) || string.IsNullOrWhiteSpace(application.Company))
                return BadRequest(new { Message = "JobTitle and Company are required." });

            if (application.Date > DateTime.Now)
                return BadRequest(new { Message = "Date cannot be in the future." });


            // Set the user ID and fetch the user details
            application.UserId = userId;
            application.User = db.Users.Find(userId);

            // Process technologies from the input string
            application.TechnologiesIds = await ProcessTechnologies(application.TechnologiesIdsString);
            application.Technologies = new List<Technology>();

            // Add technologies to the application
            for (int i = 0; i < application.TechnologiesIds.Count; i++)
            {
                int technologyId = application.TechnologiesIds[i];
                var technology = await db.Technologies.FindAsync(technologyId);

                if (technology != null)
                {
                    application.Technologies.Add(technology);
                }
            }

            // Save the application to the database
            db.Applications.Add(application);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = application.Id }, application);
        }

        // POST: api/Applications/upload
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(int id, [FromForm] IFormFile PdfFile)
        {
            // Retrieve the authenticated user's ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Fetch the application by ID and user ID
            Application? application = await db.Applications
                .Include(a => a.User)
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            // Validate the uploaded file
            if (PdfFile != null && PdfFile.Length > 0)
            {
                var allowedExtensions = new[] { ".pdf" };
                var fileExtension = Path.GetExtension(PdfFile.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return StatusCode(400, new { Message = "The file must be a document (.pdf)" });
                }

                // Generate a unique file name and save the file
                var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                var storagePath = Path.Combine(_env.WebRootPath, "Documents/CoverLetters/", uniqueFileName);
                var databaseFileName = "/Documents/CoverLetters/" + uniqueFileName;

                using (var fileStream = new FileStream(storagePath, FileMode.Create))
                {
                    await PdfFile.CopyToAsync(fileStream);
                }

                // Update the application with the file path
                application.Path = databaseFileName;
            }

            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = application.Id }, application);
        }

        // PUT: api/Applications/edit/{id}
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Application updatedApplication)
        {
            // Validate the application ID
            if (id != updatedApplication.Id)
            {
                return BadRequest(new { Message = "Application Id mismatch" });
            }

            // Fetch the application by ID
            var application = await db.Applications
                .Include(a => a.Technologies)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound(new { Message = "Application not found" });
            }

            // Retrieve the authenticated user's ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            // Check if the user is authorized to edit the application
            if (application.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to edit this application" });
            }

            //// Validate the updated application model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(updatedApplication.JobTitle) || string.IsNullOrWhiteSpace(updatedApplication.Company))
                return BadRequest(new { Message = "JobTitle and Company are required." });

            if (updatedApplication.Date > DateTime.Now)
                return BadRequest(new { Message = "Date cannot be in the future." });


            // Update application details
            application.JobTitle = updatedApplication.JobTitle;
            application.Company = updatedApplication.Company;
            application.Location = updatedApplication.Location;
            application.Date = updatedApplication.Date;
            application.Link = updatedApplication.Link;
            application.JobType = updatedApplication.JobType;
            application.Availability = updatedApplication.Availability;
            application.Status = updatedApplication.Status;

            // Process technologies and update the application
            updatedApplication.TechnologiesIds = await ProcessTechnologies(updatedApplication.TechnologiesIdsString);

            var addedIds = updatedApplication.TechnologiesIds
                .Except(application.TechnologiesIds)
                .ToList();

            var removedIds = application.TechnologiesIds
                .Except(updatedApplication.TechnologiesIds)
                .ToList();

            application.TechnologiesIds = updatedApplication.TechnologiesIds;

            var addedTechnologies = new List<Technology>();
            foreach (var addedId in addedIds)
            {
                var technology = await db.Technologies.FindAsync(addedId);
                if (technology != null)
                {
                    addedTechnologies.Add(technology);
                }
            }

            var removedTechnologies = new List<Technology>();
            foreach (var removedId in removedIds)
            {
                var technology = await db.Technologies.FindAsync(removedId);
                if (technology != null)
                {
                    removedTechnologies.Add(technology);
                }
            }

            foreach (var removedTechnology in removedTechnologies)
            {
                application.Technologies.Remove(removedTechnology);
            }

            foreach (var addedTechnology in addedTechnologies)
            {
                application.Technologies.Add(addedTechnology);
            }

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while updating the application", Error = ex.Message });
            }

            return Ok(new { Message = "Application updated successfully" });
        }

        // DELETE: api/Applications/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Fetch the application by ID
            var application = await db.Applications.FindAsync(id);

            if (application == null)
            {
                return NotFound(new { Message = "Application not found" });
            }

            // Retrieve the authenticated user's ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            // Check if the user is authorized to delete the application
            if (application.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to delete this application" });
            }

            // Remove the application from the database
            db.Applications.Remove(application);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while deleting the application", Error = ex.Message });
            }

            return Ok(new { Message = "Application deleted successfully" });
        }

        // Endpoint to get a summary of applications for the authenticated user
        [HttpGet("summary")]
        public async Task<IActionResult> Summary()
        {
            // Retrieve the authenticated user's ID from the claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // If the user is not authenticated, return an Unauthorized response
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Fetch all applications associated with the authenticated user from the database
            var applications = await db.Applications
                .Where(a => a.UserId == userId)
                .ToListAsync();

            // If no applications are found, return a summary with zero values
            if (applications.Count == 0)
            {
                return Ok(new
                {
                    TotalApplications = 0,
                    ActiveApplications = 0,
                    Stages = new Dictionary<string, int>()
                });
            }

            // Calculate the total number of applications
            var totalApplications = applications.Count;

            // Count the number of active applications
            var activeApplications = applications.Count(a => a.Status == Status.Active);

            // Group applications by their stage and count them, excluding NULL and Active statuses
            var stageCounts = applications
                .Where(a => a.Status != Status.NULL && a.Status != Status.Active)
                .GroupBy(a => a.Status)
                .ToDictionary(
                    g => g.Key.ToString(),
                    g => g.Count()
                );

            // Return the summary data
            return Ok(new
            {
                TotalApplications = totalApplications,
                ActiveApplications = activeApplications,
                Stages = stageCounts
            });
        }

        // Endpoint to get response stages for the authenticated user
        [HttpGet("stages")]
        public async Task<IActionResult> Stages()
        {
            // Retrieve the authenticated user's ID from the claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // If the user is not authenticated, return an Unauthorized response
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Fetch all responses associated with the user's applications from the database
            var responses = await db.Responses
                .Where(r => r.Application != null && r.Application.UserId == userId)
                .ToListAsync();

            // If no responses are found, return a message indicating no stages
            if (responses.Count == 0)
            {
                return Ok(new { Message = "No response stages found", Stages = new Dictionary<string, int>() });
            }

            // Group responses by their action and count them, excluding NULL actions
            var stageCounts = responses
                .Where(r => r.Action != Models.Action.NULL)
                .GroupBy(r => r.Action)
                .ToDictionary(
                    g => g.Key.ToString(),
                    g => g.Count()
                );

            // Return the response stage data
            return Ok(new
            {
                TotalStages = responses.Count,
                Stages = stageCounts
            });
        }

        // Helper method to process a comma-separated string of technology names
        public async Task<List<int>> ProcessTechnologies(string? technologiesString)
        {
            // If the input string is null or empty, return an empty list
            if (string.IsNullOrWhiteSpace(technologiesString))
            {
                return new List<int>();
            }

            // Split the string into individual technology names and initialize a list for IDs
            var technologyNames = technologiesString.Split(',', StringSplitOptions.RemoveEmptyEntries);
            var technologyIds = new List<int>();

            // Iterate through each technology name
            foreach (var techName in technologyNames)
            {
                var trimmedName = techName.Trim();

                // Skip empty or whitespace names
                if (string.IsNullOrWhiteSpace(trimmedName))
                {
                    continue;
                }

                // Check if the technology already exists in the database
                var technology = await db.Technologies.FirstOrDefaultAsync(t => t.Name == trimmedName);

                if (technology != null)
                {
                    // If it exists, add its ID to the list
                    technologyIds.Add(technology.Id);
                }
                else
                {
                    // If it doesn't exist, create a new technology and save it to the database
                    var newTechnology = new Technology { Name = trimmedName };
                    db.Technologies.Add(newTechnology);
                    await db.SaveChangesAsync();

                    // Add the new technology's ID to the list
                    technologyIds.Add(newTechnology.Id);
                }
            }

            // Return the list of technology IDs
            return technologyIds;
        }

    }
}

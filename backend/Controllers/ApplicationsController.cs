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

        public ApplicationsController(
            AppDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IWebHostEnvironment env
        )
        {
            db = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _env = env; 
        }


        // GET: api/Aplications/index
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Application>>> Index()
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            var applications = await db.Applications
                .Include(a => a.Technologies)
                .Include(a => a.User)
                .Where(a => a.UserId == userId)
                .ToListAsync();

            if (applications == null || applications.Count == 0)
                return NotFound();


            return Ok(applications);
        }

        // GET: api/Aplications/show/{id}
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Application>> Show(int id)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            var application = await db.Applications
                .Include(a => a.Technologies)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (application == null)
                return NotFound();

            return Ok(application);
        }

        // POST api/Applications/new
        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] Application application)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            application.UserId = userId;
            application.User = db.Users.Find(userId);

            application.TechnologiesIds = await ProcessTechnologies(application.TechnologiesIdsString);
            application.Technologies = new List<Technology>();

            for (int i = 0; i < application.TechnologiesIds.Count; i++)
            {
                int technologyId = application.TechnologiesIds[i];
                var technology = await db.Technologies.FindAsync(technologyId);

                if (technology != null)
                {
                    application.Technologies.Add(technology);
                }
            }

            db.Applications.Add(application);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = application.Id }, application);
        }


        [HttpPost("upload")]
        public async Task<IActionResult> Upload(int id, [FromForm] IFormFile PdfFile)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            Application? application = await db.Applications
                .Include(a => a.User)
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);


            if (PdfFile != null && PdfFile.Length > 0)
            {
                var allowedExtensions = new[] { ".pdf" };

                var fileExtension = Path.GetExtension(PdfFile.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return StatusCode(400, new { Message = "The file must be a document (.pdf)" });
                }
                var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                var storagePath = Path.Combine(_env.WebRootPath, "Documents/CoverLetters/", uniqueFileName);
                var databaseFileName = "/Documents/CoverLetters/" + uniqueFileName;


                using (var fileStream = new FileStream(storagePath, FileMode.Create))
                {
                    await PdfFile.CopyToAsync(fileStream);
                }


                application.Path = databaseFileName;

            }

            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = application.Id }, application);
        }


        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Application updatedApplication)
        {
            if (id != updatedApplication.Id)
            {
                return BadRequest(new { Message = "Application Id mismatch" });
            }

            var application = await db.Applications
                .Include(a => a.Technologies)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (application == null)
            {
                return NotFound(new { Message = "Application not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            if (application.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to edit this application" });
            }


            application.JobTitle = updatedApplication.JobTitle;
            application.Company = updatedApplication.Company;
            application.Location = updatedApplication.Location;
            application.Date = updatedApplication.Date;
            application.Link = updatedApplication.Link;
            application.JobType = updatedApplication.JobType;
            application.Availability = updatedApplication.Availability;
            application.Status = updatedApplication.Status;
            
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


        //// DELETE api/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var application = await db.Applications.FindAsync(id);


            if (application == null)
            {
                return NotFound(new { Message = "Application not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            if (application.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to delete this application" });
            }

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

        [HttpGet("summary")]
        public async Task<IActionResult> Summary()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var applications = await db.Applications
                .Where(a => a.UserId == userId)
                .ToListAsync();

            if (applications.Count == 0)
            {
                return Ok(new
                {
                    TotalApplications = 0,
                    ActiveApplications = 0,
                    Stages = new Dictionary<string, int>()
                });
            }

            var totalApplications = applications.Count;
            var activeApplications = applications.Count(a => a.Status == Status.Active);

            // Count applications by stage (excluding NULL & Active)
            var stageCounts = applications
                .Where(a => a.Status != Status.NULL && a.Status != Status.Active)
                .GroupBy(a => a.Status)
                .ToDictionary(
                    g => g.Key.ToString(),
                    g => g.Count()
                );

            return Ok(new
            {
                TotalApplications = totalApplications,
                ActiveApplications = activeApplications,
                Stages = stageCounts
            });
        }


        [HttpGet("stages")]
        public async Task<IActionResult> Stages()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var responses = await db.Responses
                .Where(r => r.Application != null && r.Application.UserId == userId)
                .ToListAsync();

            if (responses.Count == 0)
            {
                return Ok(new { Message = "No response stages found", Stages = new Dictionary<string, int>() });
            }

            var stageCounts = responses
                .Where(r => r.Action != Models.Action.NULL)
                .GroupBy(r => r.Action)
                .ToDictionary(
                    g => g.Key.ToString(),
                    g => g.Count()
                );

            return Ok(new
            {
                TotalStages = responses.Count,
                Stages = stageCounts
            });
        }

        public async Task<List<int>> ProcessTechnologies(string? technologiesString)
        {
            if (string.IsNullOrWhiteSpace(technologiesString))
            {
                return new List<int>();
            }

            var technologyNames = technologiesString.Split(',', StringSplitOptions.RemoveEmptyEntries);
            var technologyIds = new List<int>();

            foreach (var techName in technologyNames)
            {
                var trimmedName = techName.Trim();

                if (string.IsNullOrWhiteSpace(trimmedName))
                {
                    continue;
                }

                var technology = await db.Technologies.FirstOrDefaultAsync(t => t.Name == trimmedName);

                if (technology != null)
                {
                    technologyIds.Add(technology.Id);
                }
                else
                {
                    var newTechnology = new Technology { Name = trimmedName };
                    db.Technologies.Add(newTechnology);
                    await db.SaveChangesAsync();

                    technologyIds.Add(newTechnology.Id);
                }
            }

            return technologyIds;
        }


    }
}

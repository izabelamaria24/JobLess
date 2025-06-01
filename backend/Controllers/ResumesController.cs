using JoblessAPI.Data;
using JoblessAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using System.Security.Claims;
using static System.Net.Mime.MediaTypeNames;

namespace JoblessAPI.Controllers
{
    // Defines the route for the controller and marks it as an API controller.
    [Route("api/[controller]")]
    [ApiController]
    public class ResumesController : ControllerBase
    {
        // Dependency injection for database context, user manager, role manager, and environment.
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IWebHostEnvironment _env;

        // Constructor to initialize dependencies.
        public ResumesController(
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

        // Retrieves all resumes for the authenticated user.
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Resume>>> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var resumes = await db.Resumes
                .Include(r => r.Technologies) // Includes related technologies.
                .Include(a => a.User) // Includes related user.
                .Where(r => r.UserId == userId) // Filters resumes by user ID.
                .ToListAsync();

            if (resumes == null || resumes.Count == 0)
                return NotFound();

            return Ok(resumes);
        }

        // Retrieves a specific resume by ID for the authenticated user.
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Resume>> Show(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var resume = await db.Resumes
                .Include(r => r.Technologies) // Includes related technologies.
                .Include(a => a.User) // Includes related user.
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId); // Filters by ID and user ID.

            if (resume == null)
                return NotFound();

            return Ok(resume);
        }

        // Creates a new resume for the authenticated user.
        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] Resume resume)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Validate required fields
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(resume.Description))
                return BadRequest(new { Message = "Description is required." });

            if (string.IsNullOrWhiteSpace(resume.Experience))
                return BadRequest(new { Message = "Experience is required." });

            resume.UserId = userId;
            resume.User = db.Users.Find(userId); // Associates the resume with the user.

            // Processes technologies from the input string.
            resume.TechnologiesIds = await ProcessTechnologies(resume.TechnologiesIdsString);
            resume.Technologies = new List<Technology>();

            // Adds technologies to the resume.
            for (int i = 0; i < resume.TechnologiesIds.Count; i++)
            {
                int technologyId = resume.TechnologiesIds[i];
                var technology = await db.Technologies.FindAsync(technologyId);

                if (technology != null)
                {
                    resume.Technologies.Add(technology);
                }
            }

            db.Resumes.Add(resume); // Adds the resume to the database.
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = resume.Id }, resume);
        }

        // Uploads a PDF file for a specific resume.
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(int id, [FromForm] IFormFile PdfFile)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            Resume? resume = await db.Resumes
                .Include(a => a.User) // Includes related user.
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId); // Filters by ID and user ID.

            if (PdfFile != null && PdfFile.Length > 0)
            {
                var allowedExtensions = new[] { ".pdf" };

                var fileExtension = Path.GetExtension(PdfFile.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return StatusCode(400, new { Message = "The file must be a document (.pdf)" });
                }

                // Generates a unique file name and saves the file.
                var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                var storagePath = Path.Combine(_env.WebRootPath, "Documents/Resumes/", uniqueFileName);
                var databaseFileName = "/Documents/Resumes/" + uniqueFileName;

                using (var fileStream = new FileStream(storagePath, FileMode.Create))
                {
                    await PdfFile.CopyToAsync(fileStream);
                }

                resume.Path = databaseFileName; // Updates the resume's file path.
            }

            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = resume.Id }, resume);
        }

        // Updates an existing resume for the authenticated user.
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Resume updatedResume)
        {
            if (id != updatedResume.Id)
            {
                return BadRequest(new { Message = "Resume Id mismatch" });
            }

            var resume = await db.Resumes
                .Include(r => r.Technologies) // Includes related technologies.
                .FirstOrDefaultAsync(r => r.Id == id); // Finds the resume by ID.

            if (resume == null)
            {
                return NotFound(new { Message = "Resume not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (resume.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to edit this resume" });
            }

            // Validate required fields
            if (string.IsNullOrWhiteSpace(updatedResume.Description))
                return BadRequest(new { Message = "Description is required." });

            if (string.IsNullOrWhiteSpace(updatedResume.Experience))
                return BadRequest(new { Message = "Experience is required." });


            // Updates resume properties
            resume.Description = updatedResume.Description;
            resume.Experience = updatedResume.Experience;
            resume.Path = updatedResume.Path;
            resume.LinkedIn = updatedResume.LinkedIn;
            resume.GitHub = updatedResume.GitHub;

            // Processes technologies and updates the resume's technology list.
            updatedResume.TechnologiesIds = await ProcessTechnologies(updatedResume.TechnologiesIdsString);

            var addedIds = updatedResume.TechnologiesIds
                .Except(resume.TechnologiesIds)
                .ToList();

            var removedIds = resume.TechnologiesIds
                .Except(updatedResume.TechnologiesIds)
                .ToList();

            resume.TechnologiesIds = updatedResume.TechnologiesIds;

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
                resume.Technologies.Remove(removedTechnology);
            }

            foreach (var addedTechnology in addedTechnologies)
            {
                resume.Technologies.Add(addedTechnology);
            }

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while updating the resume", Error = ex.Message });
            }

            return Ok(new { Message = "Resume updated successfully" });
        }

        // Deletes a specific resume for the authenticated user.
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var resume = await db.Resumes.FindAsync(id);
            if (resume == null)
            {
                return NotFound(new { Message = "Resume not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (resume.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to delete this resume" });
            }

            db.Resumes.Remove(resume); // Removes the resume from the database.

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while deleting the resume", Error = ex.Message });
            }

            return Ok(new { Message = "Resume deleted successfully" });
        }

        // Processes a comma-separated string of technology names and returns their IDs.
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
                    db.Technologies.Add(newTechnology); // Adds new technology to the database.
                    await db.SaveChangesAsync();

                    technologyIds.Add(newTechnology.Id);
                }
            }

            return technologyIds;
        }
    }
}
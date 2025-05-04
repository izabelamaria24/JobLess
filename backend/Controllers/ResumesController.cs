using JoblessAPI.Data;
using JoblessAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using System.Security.Claims;

namespace JoblessAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumesController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IWebHostEnvironment _env;

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

        // GET: api/Resumes/index
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Resume>>> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var resumes = await db.Resumes
                .Include(r => r.Technologies)
                .Include(a => a.User)
                .Where(r => r.UserId == userId)
                .ToListAsync();

            if (resumes == null || resumes.Count == 0)
                return NotFound();

            return Ok(resumes);
        }

        // GET: api/Resumes/show/{id}
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Resume>> Show(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var resume = await db.Resumes
                .Include(r => r.Technologies)
                .Include(a => a.User)
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (resume == null)
                return NotFound();

            return Ok(resume);
        }

        // POST: api/Resumes/new
        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] Resume resume)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            resume.UserId = userId;
            resume.User = db.Users.Find(userId);

            db.Resumes.Add(resume);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = resume.Id }, resume);
        }


        [HttpPost("upload")]
        public async Task<IActionResult> Upload(int id, [FromForm] IFormFile PdfFile)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            Resume? resume = await db.Resumes
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
                var storagePath = Path.Combine(_env.WebRootPath, "Documents/Resumes/", uniqueFileName);
                var databaseFileName = "/Documents/Resumes/" + uniqueFileName;


                using (var fileStream = new FileStream(storagePath, FileMode.Create))
                {
                    await PdfFile.CopyToAsync(fileStream);
                }


                resume.Path = databaseFileName;

            }

            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = resume.Id }, resume);


        }


        // PUT: api/Resumes/edit/{id}
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Resume updatedResume)
        {
            if (id != updatedResume.Id)
            {
                return BadRequest(new { Message = "Resume Id mismatch" });
            }

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
                return Unauthorized(new { Message = "You are not allowed to edit this resume" });
            }

            resume.Description = updatedResume.Description;
            resume.Experience = updatedResume.Experience;
            resume.Path = updatedResume.Path;
            resume.LinkedIn = updatedResume.LinkedIn;
            resume.GitHub = updatedResume.GitHub;
            resume.Technologies = updatedResume.Technologies;

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

        // DELETE: api/Resumes/delete/{id}
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

            db.Resumes.Remove(resume);

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
    }
}

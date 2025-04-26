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

        public ApplicationsController(
            AppDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager
        )
        {
            db = context;
            _userManager = userManager;
            _roleManager = roleManager;
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


            db.Applications.Add(application);
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
            application.Technologies = updatedApplication.Technologies;

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
    }
}

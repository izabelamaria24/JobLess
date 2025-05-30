using JoblessAPI.Data;
using JoblessAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JoblessAPI.Controllers
{
    // Define the route for the controller and mark it as an API controller
    [Route("api/[controller]")]
    [ApiController]
    public class TechnologiesController : ControllerBase
    {
        // Dependency injection for database context, user manager, and role manager
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        // Constructor to initialize dependencies
        public TechnologiesController(
            AppDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager
        )
        {
            db = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // GET: api/Technologies/index
        // Retrieves a list of all technologies
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Technology>>> Index()
        {
            var technologies = await db.Technologies.ToListAsync();

            // Return 404 if no technologies are found
            if (technologies == null || technologies.Count == 0)
                return NotFound();

            return Ok(technologies);
        }

        // GET: api/Technologies/show/{id}
        // Retrieves a specific technology by ID
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Technology>> Show(int id)
        {
            var technology = await db.Technologies.FindAsync(id);

            // Return 404 if the technology is not found
            if (technology == null)
                return NotFound();

            return Ok(technology);
        }

        // POST: api/Technologies/new
        // Creates a new technology
        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] Technology technology)
        {
            // Validate the request body
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Add the new technology to the database
            db.Technologies.Add(technology);
            await db.SaveChangesAsync();

            // Return the created technology
            return CreatedAtAction(nameof(Index), new { id = technology.Id }, technology);
        }

        // PUT: api/Technologies/edit/{id}
        // Updates an existing technology by ID
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Technology updatedTechnology)
        {
            // Validate that the ID in the URL matches the ID in the request body
            if (id != updatedTechnology.Id)
            {
                return BadRequest(new { Message = "Technology Id mismatch" });
            }

            // Fetch the technology by ID
            var technology = await db.Technologies.FindAsync(id);
            if (technology == null)
            {
                return NotFound(new { Message = "Technology not found" });
            }

            // Update the technology properties
            technology.Name = updatedTechnology.Name;

            try
            {
                // Save changes to the database
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while updating the technology", Error = ex.Message });
            }

            return Ok(new { Message = "Technology updated successfully" });
        }

        // DELETE: api/Technologies/delete/{id}
        // Deletes a technology by ID
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Fetch the technology by ID
            var technology = await db.Technologies.FindAsync(id);
            if (technology == null)
            {
                return NotFound(new { Message = "Technology not found" });
            }

            // Remove the technology from the database
            db.Technologies.Remove(technology);

            try
            {
                // Save changes to the database
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while deleting the technology", Error = ex.Message });
            }

            return Ok(new { Message = "Technology deleted successfully" });
        }

        // GET: api/Technologies/getApplications/{id}
        // Retrieves applications associated with a specific technology for the authenticated user
        [HttpGet("getApplications/{id}")]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplications(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Check if the technology exists
            var technologyExists = await db.Technologies.AnyAsync(t => t.Id == id);
            if (!technologyExists)
            {
                return NotFound(new { Message = "Technology not found" });
            }

            // Fetch applications associated with the technology and authenticated user
            var applications = await db.Technologies
                .Where(t => t.Id == id)
                .SelectMany(t => t.Applications)
                .Where(app => app.UserId == userId)
                .ToListAsync();

            return Ok(applications);
        }

        // GET: api/Technologies/getResumes/{id}
        // Retrieves resumes associated with a specific technology for the authenticated user
        [HttpGet("getResumes/{id}")]
        public async Task<ActionResult<IEnumerable<Resume>>> GetResumes(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Check if the technology exists
            var technologyExists = await db.Technologies.AnyAsync(t => t.Id == id);
            if (!technologyExists)
            {
                return NotFound(new { Message = "Technology not found" });
            }

            // Fetch resumes associated with the technology and authenticated user
            var resumes = await db.Technologies
                .Where(t => t.Id == id)
                .SelectMany(t => t.Resumes)
                .Where(resume => resume.UserId == userId)
                .ToListAsync();

            return Ok(resumes);
        }
    }
}
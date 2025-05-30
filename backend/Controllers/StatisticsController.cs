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
    public class StatisticsController : ControllerBase
    {
        // Dependency injection for database context, user manager, and role manager
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        // Constructor to initialize dependencies
        public StatisticsController(
            AppDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager
        )
        {
            db = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // GET: api/Statistics/index
        // Retrieves a list of statistics for the authenticated user
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Statistic>>> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Fetch statistics associated with the authenticated user
            var statistics = await db.Statistics
                .Include(a => a.User)
                .Where(s => s.UserId == userId)
                .ToListAsync();

            // Return 404 if no statistics are found
            if (statistics == null || statistics.Count == 0)
                return NotFound();

            return Ok(statistics);
        }

        // GET: api/Statistics/show/{id}
        // Retrieves a specific statistic by ID for the authenticated user
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Statistic>> Show(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Fetch the statistic by ID and ensure it belongs to the authenticated user
            var statistic = await db.Statistics
                .Include(a => a.User)
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            // Return 404 if the statistic is not found
            if (statistic == null)
                return NotFound();

            return Ok(statistic);
        }

        // POST: api/Statistics/new
        // Creates a new statistic for the authenticated user
        [HttpPost("new")]
        public async Task<IActionResult> New()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Calculate statistics based on the user's applications
            var totalApplications = await db.Applications
                .Where(a => a.UserId == userId)
                .CountAsync();

            var openApplications = await db.Applications
                .Where(a => a.UserId == userId && a.Status == Status.Active)
                .CountAsync();

            // Create a new statistic object
            var statistic = new Statistic
            {
                UserId = userId,
                TotalApplications = totalApplications,
                OpenApplications = openApplications,
                Date = DateTime.UtcNow,
                User = db.Users.Find(userId)
            };

            // Add the statistic to the database and save changes
            db.Statistics.Add(statistic);
            await db.SaveChangesAsync();

            // Return the created statistic
            return CreatedAtAction(nameof(Show), new { id = statistic.Id }, statistic);
        }

        // PUT: api/Statistics/edit/{id}
        // Updates an existing statistic for the authenticated user
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Statistic updatedStatistic)
        {
            // Validate that the ID in the URL matches the ID in the request body
            if (id != updatedStatistic.Id)
            {
                return BadRequest(new { Message = "Statistic Id mismatch" });
            }

            // Fetch the statistic by ID
            var statistic = await db.Statistics.FindAsync(id);
            if (statistic == null)
            {
                return NotFound(new { Message = "Statistic not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Ensure the statistic belongs to the authenticated user
            if (statistic.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to edit this statistic" });
            }

            // Update the statistic properties
            statistic.TotalApplications = updatedStatistic.TotalApplications;
            statistic.OpenApplications = updatedStatistic.OpenApplications;
            statistic.Date = DateTime.UtcNow;

            try
            {
                // Save changes to the database
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while updating the statistic", Error = ex.Message });
            }

            return Ok(new { Message = "Statistic updated successfully" });
        }

        // DELETE: api/Statistics/delete/{id}
        // Deletes a statistic for the authenticated user
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Fetch the statistic by ID
            var statistic = await db.Statistics.FindAsync(id);
            if (statistic == null)
            {
                return NotFound(new { Message = "Statistic not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if the user is authenticated
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Ensure the statistic belongs to the authenticated user
            if (statistic.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to delete this statistic" });
            }

            // Remove the statistic from the database
            db.Statistics.Remove(statistic);

            try
            {
                // Save changes to the database
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while deleting the statistic", Error = ex.Message });
            }

            return Ok(new { Message = "Statistic deleted successfully" });
        }
    }
}
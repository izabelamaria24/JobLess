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
    public class StatisticsController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

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
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Statistic>>> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var statistics = await db.Statistics
                .Where(s => s.UserId == userId)
                .ToListAsync();

            if (statistics == null || statistics.Count == 0)
                return NotFound();

            return Ok(statistics);
        }

        // GET: api/Statistics/show/{id}
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Statistic>> Show(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var statistic = await db.Statistics
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (statistic == null)
                return NotFound();

            return Ok(statistic);
        }

        // POST: api/Statistics/new
        [HttpPost("new")]
        public async Task<IActionResult> New()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // Query the Applications table to calculate statistics
            var totalApplications = await db.Applications
                .Where(a => a.UserId == userId)
                .CountAsync();

            var openApplications = await db.Applications
                .Where(a => a.UserId == userId && a.Status == "Active")
                .CountAsync();

            var statistic = new Statistic
            {
                UserId = userId,
                TotalApplications = totalApplications,
                OpenApplications = openApplications,
                Date = DateTime.UtcNow
            };

            db.Statistics.Add(statistic);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Show), new { id = statistic.Id }, statistic);
        }


        // PUT: api/Statistics/edit/{id}
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Statistic updatedStatistic)
        {
            if (id != updatedStatistic.Id)
            {
                return BadRequest(new { Message = "Statistic Id mismatch" });
            }

            var statistic = await db.Statistics.FindAsync(id);
            if (statistic == null)
            {
                return NotFound(new { Message = "Statistic not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (statistic.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to edit this statistic" });
            }

            statistic.TotalApplications = updatedStatistic.TotalApplications;
            statistic.OpenApplications = updatedStatistic.OpenApplications;
            statistic.Date = DateTime.UtcNow; 

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while updating the statistic", Error = ex.Message });
            }

            return Ok(new { Message = "Statistic updated successfully" });
        }

        // DELETE: api/Statistics/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var statistic = await db.Statistics.FindAsync(id);
            if (statistic == null)
            {
                return NotFound(new { Message = "Statistic not found" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (statistic.UserId != userId)
            {
                return Unauthorized(new { Message = "You are not allowed to delete this statistic" });
            }

            db.Statistics.Remove(statistic);

            try
            {
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

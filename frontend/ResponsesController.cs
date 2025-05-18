using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ResponsesController : ControllerBase
    {
        private readonly ApplicationDbContext db;

        public ResponsesController(ApplicationDbContext db)
        {
            this.db = db;
        }

        [HttpGet("byApplication/{applicationId}")]
        public async Task<ActionResult<IEnumerable<Response>>> GetResponsesByApplicationId(int applicationId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // First verify the application belongs to the user
            var application = await db.Applications
                .FirstOrDefaultAsync(a => a.Id == applicationId && a.UserId == userId);
        
            if (application == null)
            {
                return NotFound(new { Message = "Application not found or doesn't belong to the user" });
            }

            // Get responses for this specific application
            var responses = await db.Responses
                .Where(r => r.ApplicationId == applicationId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(responses);
        }
    }
} 
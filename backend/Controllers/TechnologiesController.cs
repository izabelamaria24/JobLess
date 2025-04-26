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
    public class TechnologiesController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

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
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<Technology>>> Index()
        {
            var technologies = await db.Technologies.ToListAsync();

            if (technologies == null || technologies.Count == 0)
                return NotFound();

            return Ok(technologies);
        }

        // GET: api/Technologies/show/{id}
        [HttpGet("show/{id}")]
        public async Task<ActionResult<Technology>> Show(int id)
        {
            var technology = await db.Technologies.FindAsync(id);

            if (technology == null)
                return NotFound();

            return Ok(technology);
        }

        // POST: api/Technologies/new
        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] Technology technology)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            db.Technologies.Add(technology);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(Index), new { id = technology.Id }, technology);
        }

        // PUT: api/Technologies/edit/{id}
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Technology updatedTechnology)
        {
            if (id != updatedTechnology.Id)
            {
                return BadRequest(new { Message = "Technology Id mismatch" });
            }

            var technology = await db.Technologies.FindAsync(id);
            if (technology == null)
            {
                return NotFound(new { Message = "Technology not found" });
            }

            technology.Name = updatedTechnology.Name;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while updating the technology", Error = ex.Message });
            }

            return Ok(new { Message = "Technology updated successfully" });
        }

        // DELETE: api/Technologies/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var technology = await db.Technologies.FindAsync(id);
            if (technology == null)
            {
                return NotFound(new { Message = "Technology not found" });
            }

            db.Technologies.Remove(technology);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "An error occurred while deleting the technology", Error = ex.Message });
            }

            return Ok(new { Message = "Technology deleted successfully" });
        }
    }
}

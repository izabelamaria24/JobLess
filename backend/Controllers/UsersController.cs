using JoblessAPI.Data;
using JoblessAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JoblessAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(
            AppDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager
        )
        {
            db = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // GET: api/Users/index
        [HttpGet("index")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<User>>> Index()
        {
            var users = await db.Users.ToListAsync();
            var result = users.Select(user => new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.FirstName,
                user.LastName,
                user.PhoneNumber
            });

            return Ok(result);
        }
       

        // GET: api/Users/show/{id}
        [HttpGet("show/{id}")]
        public async Task<ActionResult<User>> Show(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (userId != id && !User.IsInRole("Admin"))
            {
                return Unauthorized(new { Message = "You do not have permission to access this user" });
            }

            var user = await db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(user);
        }

        // PUT: api/Users/edit/{id}
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(string id, [FromBody] User updatedUser)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            if (userId != id && !User.IsInRole("Admin"))
            {
                return Unauthorized(new { Message = "You do not have permission to access this user" });
            }

            if (id != updatedUser.Id)
                return BadRequest(new { Message = "User ID mismatch" });

            var user = await db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Phone = updatedUser.Phone;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "Error updating user", Error = ex.Message });
            }

            var userInfo = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Phone,
                user.UserName,
                user.Email
            };

            return Ok(new { User = userInfo });
        }

        // DELETE: api/Users/delete/{id}
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            try
            {
                db.Users.Remove(user);
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "Error deleting user", Error = ex.Message });
            }

            return Ok(new { Message = "User deleted successfully" });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }

            await _userManager.UpdateSecurityStampAsync(user);

            return Ok(new { Message = "Password changed successfully." });
        }

        [HttpGet("whoami")]
        public async Task<IActionResult> WhoAmI()
        {
            var user = await _userManager.GetUserAsync(User);
            if(user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(new { Id = user.Id });
        }

    }
}

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
        public async Task<ActionResult<IEnumerable<User>>> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            if (!isAdmin)
            {
                return Unauthorized(new { Message = "You do not have permission to access this" });
            }

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
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
            {
                return NotFound(new { Message = "Current user not found" });
            }

            var targetUser = await _userManager.FindByIdAsync(id);
            if (targetUser == null)
            {
                return NotFound(new { Message = "Target user not found" });
            }

            var isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin");
            if (!isAdmin && currentUserId != id)
            {
                return Unauthorized(new { Message = "You do not have permission to access this user" });
            }

            var userInfo = new
            {
                targetUser.Id,
                targetUser.UserName,
                targetUser.Email,
                targetUser.FirstName,
                targetUser.LastName,
                targetUser.PhoneNumber
            };

            return Ok(userInfo);
        }

        // PUT: api/Users/edit/{id}
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(string id, [FromBody] User updatedUser)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
            {
                return NotFound(new { Message = "Current user not found" });
            }

            var targetUser = await _userManager.FindByIdAsync(id);
            if (targetUser == null)
            {
                return NotFound(new { Message = "Target user not found" });
            }

            var isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin");
            if (!isAdmin && currentUserId != id)
            {
                return Unauthorized(new { Message = "You do not have permission to edit this user" });
            }

            if (id != updatedUser.Id)
            {
                return BadRequest(new { Message = "User ID mismatch" });
            }

            targetUser.FirstName = updatedUser.FirstName;
            targetUser.LastName = updatedUser.LastName;
            targetUser.Phone = updatedUser.Phone;

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
                targetUser.Id,
                targetUser.FirstName,
                targetUser.LastName,
                targetUser.Phone,
                targetUser.UserName,
                targetUser.Email
            };

            return Ok(new { User = userInfo });
        }

        // DELETE: api/Users/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
            {
                return NotFound(new { Message = "Current user not found" });
            }

            var targetUser = await _userManager.FindByIdAsync(id);
            if (targetUser == null)
            {
                return NotFound(new { Message = "Target user not found" });
            }

            var isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin");
            if (!isAdmin && currentUserId != id)
            {
                return Unauthorized(new { Message = "You do not have permission to delete this user" });
            }

            try
            {
                db.Users.Remove(targetUser);
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

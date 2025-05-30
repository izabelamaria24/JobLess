using JoblessAPI.Data;
using JoblessAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

// Namespace declaration for the UsersController class
namespace JoblessAPI.Controllers
{
    // Specifies the route for the controller and marks it as an API controller
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // Dependency injection for database context, user manager, and role manager
        private readonly AppDbContext db; // Provides access to the application's database.
        private readonly UserManager<User> _userManager; // Manages user-related operations such as authentication and role assignment.
        private readonly RoleManager<IdentityRole> _roleManager; // Manages role-related operations.

        // Constructor to initialize dependencies
        public UsersController(
            AppDbContext context, // Database context for accessing data.
            UserManager<User> userManager, // User manager for handling user operations.
            RoleManager<IdentityRole> roleManager // Role manager for handling role operations.
        )
        {
            db = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // Endpoint to retrieve a list of users (Admin access required)
        [HttpGet("index")]
        public async Task<ActionResult<IEnumerable<User>>> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Retrieves the current user's ID.
            if (userId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" }); // Returns unauthorized if user is not authenticated.
            }

            var user = await _userManager.FindByIdAsync(userId); // Finds the current user by ID.
            if (user == null)
            {
                return NotFound(new { Message = "User not found" }); // Returns not found if user does not exist.
            }

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin"); // Checks if the user has Admin role.
            if (!isAdmin)
            {
                return Unauthorized(new { Message = "You do not have permission to access this" }); // Returns unauthorized if user is not an Admin.
            }

            var users = await db.Users.ToListAsync(); // Retrieves all users from the database.
            var result = users.Select(user => new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.FirstName,
                user.LastName,
                user.PhoneNumber
            }); // Maps user data to a simplified format.

            return Ok(result); // Returns the list of users.
        }

        // Endpoint to retrieve details of a specific user (Admin or self-access required)
        [HttpGet("show/{id}")]
        public async Task<ActionResult<User>> Show(string id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Retrieves the current user's ID.
            if (currentUserId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" }); // Returns unauthorized if user is not authenticated.
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId); // Finds the current user by ID.
            if (currentUser == null)
            {
                return NotFound(new { Message = "Current user not found" }); // Returns not found if current user does not exist.
            }

            var targetUser = await _userManager.FindByIdAsync(id); // Finds the target user by ID.
            if (targetUser == null)
            {
                return NotFound(new { Message = "Target user not found" }); // Returns not found if target user does not exist.
            }

            var isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin"); // Checks if the current user has Admin role.
            if (!isAdmin && currentUserId != id)
            {
                return Unauthorized(new { Message = "You do not have permission to access this user" }); // Returns unauthorized if user is not Admin or accessing their own data.
            }

            var userInfo = new
            {
                targetUser.Id,
                targetUser.UserName,
                targetUser.Email,
                targetUser.FirstName,
                targetUser.LastName,
                targetUser.PhoneNumber
            }; // Maps target user data to a simplified format.

            return Ok(userInfo); // Returns the target user's details.
        }

        // Endpoint to edit a user's details (Admin or self-access required)
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(string id, [FromBody] User updatedUser)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Retrieves the current user's ID.
            if (currentUserId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" }); // Returns unauthorized if user is not authenticated.
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId); // Finds the current user by ID.
            if (currentUser == null)
            {
                return NotFound(new { Message = "Current user not found" }); // Returns not found if current user does not exist.
            }

            var targetUser = await _userManager.FindByIdAsync(id); // Finds the target user by ID.
            if (targetUser == null)
            {
                return NotFound(new { Message = "Target user not found" }); // Returns not found if target user does not exist.
            }

            var isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin"); // Checks if the current user has Admin role.
            if (!isAdmin && currentUserId != id)
            {
                return Unauthorized(new { Message = "You do not have permission to edit this user" }); // Returns unauthorized if user is not Admin or editing their own data.
            }

            if (id != updatedUser.Id)
            {
                return BadRequest(new { Message = "User ID mismatch" }); // Returns bad request if IDs do not match.
            }

            targetUser.FirstName = updatedUser.FirstName; // Updates the user's first name.
            targetUser.LastName = updatedUser.LastName; // Updates the user's last name.
            targetUser.Phone = updatedUser.Phone; // Updates the user's phone number.

            try
            {
                await db.SaveChangesAsync(); // Saves changes to the database.
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "Error updating user", Error = ex.Message }); // Returns bad request if an error occurs during update.
            }

            var userInfo = new
            {
                targetUser.Id,
                targetUser.FirstName,
                targetUser.LastName,
                targetUser.Phone,
                targetUser.UserName,
                targetUser.Email
            }; // Maps updated user data to a simplified format.

            return Ok(new { User = userInfo }); // Returns the updated user's details.
        }

        // Endpoint to delete a user (Admin or self-access required)
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Retrieves the current user's ID.
            if (currentUserId is null)
            {
                return Unauthorized(new { Message = "User not authenticated" }); // Returns unauthorized if user is not authenticated.
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId); // Finds the current user by ID.
            if (currentUser == null)
            {
                return NotFound(new { Message = "Current user not found" }); // Returns not found if current user does not exist.
            }

            var targetUser = await _userManager.FindByIdAsync(id); // Finds the target user by ID.
            if (targetUser == null)
            {
                return NotFound(new { Message = "Target user not found" }); // Returns not found if target user does not exist.
            }

            var isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin"); // Checks if the current user has Admin role.
            if (!isAdmin && currentUserId != id)
            {
                return Unauthorized(new { Message = "You do not have permission to delete this user" }); // Returns unauthorized if user is not Admin or deleting their own data.
            }

            try
            {
                db.Users.Remove(targetUser); // Removes the target user from the database.
                await db.SaveChangesAsync(); // Saves changes to the database.
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { Message = "Error deleting user", Error = ex.Message }); // Returns bad request if an error occurs during deletion.
            }

            return Ok(new { Message = "User deleted successfully" }); // Returns success message.
        }

        // Endpoint to change the current user's password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO model)
        {
            var user = await _userManager.GetUserAsync(User); // Retrieves the current user.
            if (user == null)
                return Unauthorized(); // Returns unauthorized if user is not authenticated.

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword); // Changes the user's password.

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description); // Collects error messages if password change fails.
                return BadRequest(new { Errors = errors }); // Returns bad request with error messages.
            }

            await _userManager.UpdateSecurityStampAsync(user); // Updates the user's security stamp after password change.

            return Ok(new { Message = "Password changed successfully." }); // Returns success message.
        }

        // Endpoint to retrieve the current user's ID
        [HttpGet("whoami")]
        public async Task<IActionResult> WhoAmI()
        {
            var user = await _userManager.GetUserAsync(User); // Retrieves the current user.
            if (user == null)
                return NotFound(new { Message = "User not found" }); // Returns not found if user does not exist.

            return Ok(new { Id = user.Id }); // Returns the current user's ID.
        }


    }
}

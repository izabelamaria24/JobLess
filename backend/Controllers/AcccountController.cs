using JoblessAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JoblessAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;

        // Constructor to inject dependencies required for user and role management
        public AccountController(UserManager<User> userManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager; // Handles user-related operations like creation and authentication
            _configuration = configuration; // Provides access to app settings, including JWT configuration
            _roleManager = roleManager; // Handles role-related operations like creation and assignment
        }

        // Endpoint to register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // Check if the incoming model is valid
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Return validation errors if the model is invalid

            // Create a new user object based on the provided registration details
            var user = new User
            {
                UserName = model.Email, // Use email as the username
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Phone = model.Phone
            };

            // Attempt to create the user in the database
            var result = await _userManager.CreateAsync(user, model.Password);

            // If user creation fails, return the errors
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Check if the "User" role exists in the system
            var roleExist = await _roleManager.RoleExistsAsync("User");
            if (!roleExist)
            {
                // Create the "User" role if it doesn't exist
                var role = new IdentityRole("User");
                await _roleManager.CreateAsync(role);
            }

            // Assign the "User" role to the newly created user
            var roleAssignResult = await _userManager.AddToRoleAsync(user, "User");

            // If role assignment fails, return the errors
            if (!roleAssignResult.Succeeded)
                return BadRequest(roleAssignResult.Errors);

            // Prepare a response object containing user details (excluding sensitive information)
            var userInfo = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Phone,
                user.UserName,
                user.Email
            };

            return Ok(userInfo); // Return the user information as the response
        }

        // Endpoint to authenticate a user and generate a JWT token
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthModel model)
        {
            // Find the user by their email address
            var user = await _userManager.FindByEmailAsync(model.Email);

            // Check if the user exists and the provided password is correct
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized(new { Message = "Invalid credentials" }); // Return an unauthorized response if authentication fails

            // Log the email for debugging purposes
            Console.WriteLine(model.Email);

            // Create claims to include in the JWT token
            var authClaims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName), // Include the username in the claims
                new Claim(ClaimTypes.NameIdentifier, user.Id), // Include the user ID in the claims
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Include a unique identifier for the token
            };

            // Generate the JWT token using the claims and signing credentials
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"], // Specify the token issuer
                audience: _configuration["Jwt:Audience"], // Specify the token audience
                expires: DateTime.Now.AddHours(3), // Set the token expiration time
                claims: authClaims, // Include the claims in the token
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])), // Use the configured signing key
                    SecurityAlgorithms.HmacSha256) // Use HMAC-SHA256 for signing
            );

            // Prepare a response object containing the token and user details
            var userInfo = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Phone,
                user.UserName,
                user.Email
            };

            var response = new
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token), // Serialize the token into a string
                User = userInfo // Include the user details in the response
            };

            return Ok(response); // Return the response containing the token and user information
        }
    }
}
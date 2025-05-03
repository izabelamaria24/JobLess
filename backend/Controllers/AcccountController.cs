using JoblessAPI.Models;
using Microsoft.AspNetCore.Http;
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


        public AccountController(UserManager<User> userManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _configuration = configuration;
            _roleManager = roleManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Phone = model.Phone
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var roleExist = await _roleManager.RoleExistsAsync("User");
            if (!roleExist)
            {
                var role = new IdentityRole("User");  // Create "User" role if it doesn't exist
                await _roleManager.CreateAsync(role);
            }

            // Assign the "User" role to the newly created user
            var roleAssignResult = await _userManager.AddToRoleAsync(user, "User");

            if (!roleAssignResult.Succeeded)
                return BadRequest(roleAssignResult.Errors);

            // Return the user object without sensitive information
            var userInfo = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Phone,
                user.UserName,
                user.Email
            };

            return Ok(userInfo);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized(new { Message = "Invalid credentials" });


            Console.WriteLine(model.Email);

            var authClaims = new[]
            {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                    SecurityAlgorithms.HmacSha256)
            );


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
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                User = userInfo
            };

            return Ok(response);
        }
    }

}

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
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext db;

        private readonly UserManager<User> _userManager;

        private readonly RoleManager<IdentityRole> _roleManager;

        public ApplicationsController(
            AppDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager
        )
        {
            db = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }


        // GET: api/Aplications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> Index()
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized(new
                {
                    Message = "User not authenticated"
                });
            }

            var applications = await db.Applications
                .Include(a => a.Technologies)
                .Where(a => a.UserId == userId)
                .ToListAsync();

            if (applications == null || applications.Count == 0)
                return NotFound();


            return Ok(applications);
        }

        //// GET api/<ApplicationsController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/<ApplicationsController>
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// PUT api/<ApplicationsController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<ApplicationsController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}

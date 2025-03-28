using JoblessAPI.Models;
using JoblessAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JoblessAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        
        [HttpGet]
        public IActionResult GetValues()
        {
            return Ok(new { message = "Hello from ASP.NET API!" });
        }

        [HttpPost]
        public IActionResult PostValues([FromBody] DataModel data)
        {
            return Ok(new
            {
                message = "Data received successfully!",
                receivedData = data
            });
        }
    }
}


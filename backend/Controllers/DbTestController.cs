using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Threading.Tasks;

namespace JoblessAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DbTestController : ControllerBase
    {
        private readonly string _connectionString = "Server=localhost;Database=JoblessDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=true;Encrypt=false;";

        [HttpGet("ping")]
        public async Task<IActionResult> PingDatabase()
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    return Ok("Database connection successful.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database connection failed: {ex.Message}");
            }
        }
    }
}

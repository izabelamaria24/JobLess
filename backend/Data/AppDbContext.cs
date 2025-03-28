using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using JoblessAPI.Models;

namespace JoblessAPI.Data
{
    namespace JoblessAPI.Data
    {
        public class AppDbContext : IdentityDbContext<IdentityUser>
        {
            public AppDbContext(DbContextOptions<AppDbContext> options)
                : base(options)
            { }
        }
    }
}


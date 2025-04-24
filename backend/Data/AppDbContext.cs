using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using JoblessAPI.Models;


namespace JoblessAPI.Data
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Resume> Resumes { get; set; }
        public DbSet<Statistic> Statistics { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Response> Responses { get; set; }

    }
}



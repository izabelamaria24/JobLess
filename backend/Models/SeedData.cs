using JoblessAPI.Data;
using JoblessAPI.Models;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var context = new AppDbContext(serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>()))
        {

            if (context.Roles.Any())
            {
                return;
            }


            context.Roles.AddRange(
            new IdentityRole { Id = "b1e9ddbe-b5fc-495c-ab73-47cf7f8f9130", Name = "Admin", NormalizedName = "Admin".ToUpper() },
            new IdentityRole { Id = "b1e9ddbe-b5fc-495c-ab73-47cf7f8f9131", Name = "Organizer", NormalizedName = "Organizer".ToUpper() },
            new IdentityRole { Id = "b1e9ddbe-b5fc-495c-ab73-47cf7f8f9132", Name = "User", NormalizedName = "User".ToUpper() }
            );

            var hasher = new PasswordHasher<User>();


            context.Users.AddRange(
            new User
            {
                Id = "70e8a9f2-588d-43bf-9a6a-87d132f66130", // primary key
                UserName = "admin@test.com",
                EmailConfirmed = true,
                NormalizedEmail = "ADMIN@TEST.COM",
                Email = "admin@test.com",
                NormalizedUserName = "ADMIN@TEST.COM",
                PasswordHash = hasher.HashPassword(null, "AdminPa55!")
            },

            new User
            {
                Id = "70e8a9f2-588d-43bf-9a6a-87d132f66131", // primary key
                UserName = "organizer@test.com",
                EmailConfirmed = true,
                NormalizedEmail = "ORGANIZER@TEST.COM",
                Email = "organizer@test.com",
                NormalizedUserName = "ORGANIZER@TEST.COM",
                PasswordHash = hasher.HashPassword(null, "OrganizerPa55!")
            },

            new User
            {
                Id = "70e8a9f2-588d-43bf-9a6a-87d132f66132", // primary key
                UserName = "user@test.com",
                EmailConfirmed = true,
                NormalizedEmail = "USER@TEST.COM",
                Email = "user@test.com",
                NormalizedUserName = "USER@TEST.COM",
                PasswordHash = hasher.HashPassword(null, "UserPa55!")
            }
            );


            context.UserRoles.AddRange(
            new IdentityUserRole<string>
            {
                RoleId = "b1e9ddbe-b5fc-495c-ab73-47cf7f8f9130",
                UserId = "70e8a9f2-588d-43bf-9a6a-87d132f66130"
            },
            new IdentityUserRole<string>
            {
                RoleId = "b1e9ddbe-b5fc-495c-ab73-47cf7f8f9131",
                UserId = "70e8a9f2-588d-43bf-9a6a-87d132f66131"
            },
            new IdentityUserRole<string>
            {
                RoleId = "b1e9ddbe-b5fc-495c-ab73-47cf7f8f9132",
                UserId = "70e8a9f2-588d-43bf-9a6a-87d132f66132"
            }
            );

            context.SaveChanges();
        }


    }

}
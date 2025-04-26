using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace JoblessAPI.Models
{
    public class User : IdentityUser
    {

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        [Phone(ErrorMessage = "Numarul de telefon nu este valid")]
        public string? Phone { get; set; }

        [NotMapped]
        public IEnumerable<SelectListItem>? AllRoles { get; set; }

    }
}
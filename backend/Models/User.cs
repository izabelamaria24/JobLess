using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace JoblessAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Email-ul este obligatoriu")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Username-ul este obligatoriu")]
        public string Username { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        [Required(ErrorMessage = "Parola este obligatorie")]
        public string Password { get; set; }

        public string? Phone { get; set; }

        public virtual ICollection<Role>? Roles { get; set; }

        [NotMapped]
        public IEnumerable<SelectListItem>? AllRoles { get; set; }

    }
}

using System.ComponentModel.DataAnnotations;

namespace JoblessAPI.Models
{
    public class RegisterModel : AuthModel
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        [Phone(ErrorMessage = "Numarul de telefon nu este valid")]
        public string? Phone { get; set; }
    }
}

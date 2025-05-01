using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JoblessAPI.Models
{
    public class Resume
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; }

        public string? Description { get; set; }

        public string? Experience { get; set; }

        public string? Path { get; set; }

        [LinkedInUrl(ErrorMessage = "Link-ul catre LinkedIn nu este valid")]
        public string? LinkedIn { get; set; }

        [GitHubUrl(ErrorMessage = "Link-ul catre GitHub nu este valid")]
        public string? GitHub { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [JsonIgnore]
        public virtual ICollection<Technology>? Technologies { get; set; }

        [NotMapped]
        public IFormFile? File { get; set; }

    }
}

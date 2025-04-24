using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace JoblessAPI.Models
{
    public class Resume
    {
        [Key]
        public int Id { get; set; }

        public string? Description { get; set; }

        public string? Experience { get; set; }

        public string? Path { get; set; }

        public string? LinkedIn { get; set; }

        public string? GitHub { get; set; }

        public virtual User? User { get; set; }

        public virtual ICollection<Technology>? Technologies { get; set; }

        [NotMapped]
        public IFormFile? File { get; set; }

    }
}

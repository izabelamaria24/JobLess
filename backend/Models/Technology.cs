using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations;

namespace JoblessAPI.Models
{
    public class Technology
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Numele tehnologiei este obligatoriu")]
        public string Name { get; set; }

        public virtual ICollection<Resume>? Resumes { get; set; }

        public virtual ICollection<Application>? Applications { get; set; }
    }
}

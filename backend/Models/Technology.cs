using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JoblessAPI.Models
{
    public class Technology
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Numele tehnologiei este obligatoriu")]
        public string Name { get; set; }

        [JsonIgnore]
        public List<int>? ResumeIds { get; set; }

        [JsonIgnore]
        public List<int>? ApplicationIds { get; set; }

        [JsonIgnore]
        public virtual ICollection<Resume>? Resumes { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Application>? Applications { get; set; }
    }
}

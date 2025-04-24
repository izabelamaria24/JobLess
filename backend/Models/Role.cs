using System.ComponentModel.DataAnnotations;

namespace JoblessAPI.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Numele rolului este obligatoriu")]
        public string Name { get; set; }

        public virtual ICollection<User>? Users { get; set; }
    }
}

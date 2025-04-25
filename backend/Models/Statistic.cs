using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JoblessAPI.Models
{
    public class Statistic
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; }

        public int TotalApplications { get; set; }

        public int OpenApplications { get; set; }

        public DateTime Date { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

    }
}

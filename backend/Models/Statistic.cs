using System.ComponentModel.DataAnnotations;

namespace JoblessAPI.Models
{
    public class Statistic
    {
        [Key]
        public int Id { get; set; }

        public int TotalApplications { get; set; }

        public int OpenApplications { get; set; }

        public DateTime Date { get; set; }

        public virtual User? User { get; set; }

    }
}

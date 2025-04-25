using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JoblessAPI.Models
{
    public class Response
    {
        [Key]
        public int Id { get; set; }

        public int? ApplicationId { get; set; }

        public string Action { get; set; }

        public DateTime Date { get; set; }

        [ForeignKey("ApplicationId")]
        public virtual Application? Application { get; set; }

    }
}

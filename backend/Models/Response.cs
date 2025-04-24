using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations;

namespace JoblessAPI.Models
{
    public class Response
    {
        [Key]
        public int Id { get; set; }

        public string? Action { get; set; }

        public DateTime Date { get; set; }

        public virtual Application? Application { get; set; }

    }
}

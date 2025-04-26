using Microsoft.Extensions.Primitives;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JoblessAPI.Models
{
    public enum JobType
    {
        NULL,
        FullTime,
        PartTime,
        Internship,
        Freelance,
        Temporary
    }

    public enum Status
    {
        NULL,
        Active,
        Offer,
        Rejected,
        Accepted
    }
   
    public enum Availability
    {
        NULL,
        Remote,
        Hybrid,
        OnSite
    }

    public class Application
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; }

        [Required(ErrorMessage = "Titlul jobului este obligatoriu")]
        public string JobTitle { get; set; }

        [Required(ErrorMessage = "Numele companiei este obligatorie")]
        public string Company { get; set; }

        [Required(ErrorMessage = "Locatia este obligatorie")]
        public string Location { get; set; }

        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Link-ul catre aplicatie este obligatoriu")]
        public string Link { get; set; }

        [EnumDataType(typeof(JobType))]
        public JobType JobType { get; set; }

        [EnumDataType(typeof(Availability))]
        public Availability Availability { get; set; }

        [EnumDataType(typeof(Status))]
        public Status Status { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [JsonIgnore]
        public virtual ICollection<Technology>? Technologies { get; set; }
    }
}

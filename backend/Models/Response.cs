using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JoblessAPI.Models
{
    public enum Action
    {
        NULL,
        Applied,
        OnlineAssessment,
        OnlineAssessmentAutomated,
        IqTest,
        ResumeWalkthrough,
        PhoneScreening,
        PhoneInterview,
        TechnicalInterview,
        SoftSkillsInterview,
        HRInterview,
        RecorededInterview,
        OnSiteInterviews,
        Ghosted,
        Cancelled,
        Rejected,
        Accepted
    }

    public class Response
    {
        [Key]
        public int Id { get; set; }

        public int? ApplicationId { get; set; }

        [EnumDataType(typeof(Action))]
        public Action Action { get; set; }

        public DateTime Date { get; set; }

        public DateTime Deadline { get; set; }

        [ForeignKey("ApplicationId")]
        public virtual Application? Application { get; set; }

    }
}

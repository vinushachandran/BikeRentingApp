using System.ComponentModel.DataAnnotations;

namespace BikeRentingApp.Model.Report
{
    public class ReportBO
    {
        [Key]
        public int ReportID { get; set; }

        [Display(Name = "Customer ID")]
        public int? HostID { get; set; }

        [Display(Name = "Bike ID")]
        public int? BikeID { get; set; }

        [Required(ErrorMessage = "Report Message is required")]
        [Display(Name = "Report Message")]
        public string ReportMessage { get; set; }
    }
}

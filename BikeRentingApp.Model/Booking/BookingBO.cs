using System;
using System.ComponentModel.DataAnnotations;

namespace BikeRentingApp.Model
{
    public class BookingBO
    {
        [Key]
        public int BookingID { get; set; }

        [Required(ErrorMessage = "Customer ID is required")]
        [Display(Name = "Customer ID")]
        public int CustomerID { get; set; }

        [Required(ErrorMessage = "Bike ID is required")]
        [Display(Name = "Bike ID")]
        public int BikeID { get; set; }

        [Required(ErrorMessage = "Start Date is required")]
        [Display(Name = "Start Date")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End Date is required")]
        [Display(Name = "End Date")]
        public DateTime EndDate { get; set; }

        [Display(Name = "Status")]
        public string Status { get; set; } = "Pending";
    }
}

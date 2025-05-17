using System;
using System.ComponentModel.DataAnnotations;

namespace BikeRentingApp.Model
{
    public class BookingBO
    {
        [Key]
        public int BookingID { get; set; }

        [Required(ErrorMessage = "Customer ID is required.")]
        [Display(Name = "Customer ID")]
        public int CustomerID { get; set; }

        [Required(ErrorMessage = "Bike ID is required.")]
        [Display(Name = "Bike ID")]
        public int BikeID { get; set; }

        [Required(ErrorMessage = "Booking date is required.")]
        [Display(Name = "Booking Date")]
        public DateTime Date { get; set; }

        [Display(Name = "Status")]
        [MaxLength(20)]
        public string? Status { get; set; }
    }
}

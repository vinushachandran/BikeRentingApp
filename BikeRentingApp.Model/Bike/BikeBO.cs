using System.ComponentModel.DataAnnotations;

namespace BikeRentingApp.Model
{
    public class BikeBO
    {
        [Key]
        public int BikeID { get; set; }

        [Required(ErrorMessage = "Bike number is required")]
        [Display(Name = "Bike Number")]
        public string BikeNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Bike type is required")]
        [Display(Name = "Bike Type")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Bike type is required")]
        [Display(Name = "Address")]
        public required string Address { get; set; }

        [Required(ErrorMessage = "Rental price is required")]
        [Range(1, double.MaxValue, ErrorMessage = "Rental price must be greater than 0")]
        [Display(Name = "Rental Price")]
        public double RentalPrice { get; set; }

        [Display(Name = "Availability Status")]
        public bool AvailabilityStatus { get; set; }

        [Required(ErrorMessage = "Host ID is required")]
        [Display(Name = "Host ID")]
        public int HostID { get; set; }

        public byte[]? Image { get; set; }
    }
}
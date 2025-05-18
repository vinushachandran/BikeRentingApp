using System.ComponentModel.DataAnnotations;

namespace BikeRentingApp.Model
{
    public class ReviewBO
    {
        [Key]
        [Display(Name = "Review ID")]
        public int ReviewID { get; set; }

        [Required(ErrorMessage = "Customer ID is required")]
        [Display(Name = "Customer ID")]
        public int CustomerID { get; set; }

        [Required(ErrorMessage = "Bike ID is required")]
        [Display(Name = "Bike ID")]
        public int BikeID { get; set; }

        [MaxLength(500, ErrorMessage = "Comment cannot exceed 500 characters")]
        [Display(Name = "Comment")]
        public string? Comment { get; set; }

        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        [Display(Name = "Rating")]
        public int Rating { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace BikeRentingApp.Model.User
{
    public class UserBO
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string Username { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Role { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Phone number must be exactly 10 digits.")]
        public string PhoneNumber { get; set; }

        public string? TouristCountry { get; set; }

        public string? PassportNumber { get; set; }

        public string? EmergencyContactNumber { get; set; }

        public byte[]? LicenseImage { get; set; }

        public bool LicenseVerified { get; set; } = false;

    }
}

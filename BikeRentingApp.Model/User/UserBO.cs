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

        public string PhoneNumber { get; set; }

        public byte[]? LicenseImage { get; set; }

        public bool LicenseVerified { get; set; } = false;

    }
}

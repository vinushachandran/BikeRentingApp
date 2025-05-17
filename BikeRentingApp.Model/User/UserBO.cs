using System.ComponentModel.DataAnnotations;

namespace BikeRentingApp.Model.User
{
    public class UserBO
    {
        [Key]
        public long UserId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Role { get; set; }

        public string PhoneNumber { get; set; }

    }
}

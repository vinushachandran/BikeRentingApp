using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BikeRentingApp.ViewModel.UserViewModel
{
    public class UserUpdateModel
    {
        public int UserId { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;

        public string? Role { get; set; }

        public string? PhoneNumber { get; set; }


        public IFormFile? LicenseImageFile { get; set; }

        public bool LicenseVerified { get; set; } = false;
    }
}

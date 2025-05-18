using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class BikeViewModel
{

    public int BikeID { get; set; }
    [Required]
    public string BikeNumber { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    [Required]
    [Range(1, double.MaxValue)]
    public double RentalPrice { get; set; }

    public bool AvailabilityStatus { get; set; }

    [Required]
    public int HostID { get; set; }

    public IFormFile? ImageFile { get; set; }
}

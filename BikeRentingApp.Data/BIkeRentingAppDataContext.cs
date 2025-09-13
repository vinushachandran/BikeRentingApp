using BikeRentingApp.Model;
using BikeRentingApp.Model.Report;
using BikeRentingApp.Model.User;
using Microsoft.EntityFrameworkCore;

namespace BikeRentingApp.Data
{
    public class BIkeRentingAppDataContext : DbContext
    {
        public BIkeRentingAppDataContext(DbContextOptions<BIkeRentingAppDataContext> options) : base(options) { }

        public DbSet<UserBO> User { get; set; }

        public DbSet<BikeBO> Bike { get; set; }

        public DbSet<BookingBO> Booking { get; set; }

        public DbSet<ReviewBO> Reviews { get; set; }

        public DbSet<ReportBO> Report { get; set; }


    }
}

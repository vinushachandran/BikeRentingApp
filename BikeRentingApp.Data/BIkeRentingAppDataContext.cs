using BikeRentingApp.Model.User;
using Microsoft.EntityFrameworkCore;

namespace BikeRentingApp.Data
{
    public class BIkeRentingAppDataContext : DbContext
    {
        public BIkeRentingAppDataContext(DbContextOptions<BIkeRentingAppDataContext> options) : base(options) { }

        public DbSet<UserBO> User { get; set; }
    }
}

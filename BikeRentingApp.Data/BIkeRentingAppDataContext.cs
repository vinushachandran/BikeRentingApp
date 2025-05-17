using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BikeRentingApp.Data
{
    public class BIkeRentingAppDataContext:DbContext
    {
        public BIkeRentingAppDataContext(DbContextOptions<BIkeRentingAppDataContext> options) : base(options) { }
    }
}

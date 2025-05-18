using BikeRentingApp.BL.User;
using BikeRentingApp.Data;
using BikeRentingApp.Model;
using BTBS.ViewModel.RepositoryResponse;

namespace BikeRentingApp.BL
{
    public class BookingRepository
    {
        private readonly BIkeRentingAppDataContext _context;

        private UserRepository userRepository;

        public BookingRepository(BIkeRentingAppDataContext context, UserRepository userRepository)
        {
            _context = context;
            this.userRepository = userRepository;
        }

        public RepositoryResponse<IEnumerable<BookingBO>> GetAllBookings()
        {
            var response = new RepositoryResponse<IEnumerable<BookingBO>>();
            try
            {
                response.Data = _context.Booking.ToList();
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
            }
            return response;
        }

        public RepositoryResponse<BookingBO> GetBookingById(int id)
        {
            var response = new RepositoryResponse<BookingBO>();
            try
            {
                var booking = _context.Booking.Find(id);
                if (booking == null)
                {
                    response.Success = false;
                    response.Message.Add("Booking not found.");
                }
                else
                {
                    response.Data = booking;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
            }
            return response;
        }

        public RepositoryResponse<bool> AddBooking(BookingBO booking)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                if (userRepository.GetUserById(booking.CustomerID).Data.LicenseImage == null)
                {
                    response.Success = false;
                    response.Message.Add("Please upload your licence.");
                    return response;
                }

                if (userRepository.GetUserById(booking.CustomerID).Data.LicenseVerified == false)
                {
                    response.Success = false;
                    response.Message.Add("Please wait your licence not verified.");
                    return response;
                }

                var bikeExists = _context.Bike.Any(b => b.BikeID == booking.BikeID);
                if (!bikeExists)
                {
                    response.Success = false;
                    response.Message.Add("Bike does not exist.");
                    return response;
                }


                var isBooked = _context.Booking.Any(b =>
                    b.BikeID == booking.BikeID &&
                    (booking.StartDate < b.EndDate && booking.EndDate > b.StartDate));


                if (isBooked)
                {
                    response.Success = false;
                    response.Message.Add("The bike is already booked for the selected date range.");
                    return response;
                }

                booking.Status = "Booked";

                // If all checks pass, add the booking
                _context.Booking.Add(new BookingBO
                {
                    CustomerID = booking.CustomerID,
                    BikeID = booking.BikeID,
                    StartDate = booking.StartDate,
                    EndDate = booking.EndDate,
                    //Status = booking.Status
                });

                _context.SaveChanges();
                response.Data = true;
                response.Message.Add("Booking added successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error adding booking: {ex.Message}");
            }
            return response;
        }


        public RepositoryResponse<bool> UpdateBooking(BookingBO booking)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                var existing = _context.Booking.Find(booking.BookingID);
                if (existing == null)
                {
                    response.Success = false;
                    response.Message.Add("Booking not found.");
                    return response;
                }

                var bikeExists = _context.Bike.Any(b => b.BikeID == booking.BikeID);
                if (!bikeExists)
                {
                    response.Success = false;
                    response.Message.Add("Bike does not exist.");
                    return response;
                }

                var isBooked = _context.Booking.Any(b =>
                    b.BikeID == booking.BikeID &&
                    (booking.StartDate < b.EndDate && booking.EndDate > b.StartDate));

                if (isBooked)
                {
                    response.Success = false;
                    response.Message.Add("The bike is already booked for the selected date range.");
                    return response;
                }

                existing.CustomerID = booking.CustomerID;
                existing.BikeID = booking.BikeID;
                existing.StartDate = booking.StartDate;
                existing.EndDate = booking.EndDate;
                existing.Status = booking.Status;

                _context.SaveChanges();
                response.Data = true;
                response.Message.Add("Booking updated successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error updating booking: {ex.Message}");
            }
            return response;
        }


        public RepositoryResponse<bool> DeleteBooking(int id)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                var booking = _context.Booking.Find(id);
                if (booking == null)
                {
                    response.Success = false;
                    response.Message.Add("Booking not found.");
                }
                else
                {
                    _context.Booking.Remove(booking);
                    _context.SaveChanges();
                    response.Data = true;
                    response.Message.Add("Booking deleted successfully.");
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error deleting booking: {ex.Message}");
            }
            return response;
        }
    }
}

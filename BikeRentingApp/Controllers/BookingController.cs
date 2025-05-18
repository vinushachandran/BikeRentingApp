using BikeRentingApp.BL;
using BikeRentingApp.Model;
using BTBS.ViewModel.RepositoryResponse;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace BikeRentingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingRepository _bookingRepo;

        public BookingController(BookingRepository bookingRepo)
        {
            _bookingRepo = bookingRepo;
        }

        [HttpGet]
        public ActionResult<RepositoryResponse<IEnumerable<BookingBO>>> GetAllBookings()
        {
            var response = _bookingRepo.GetAllBookings();
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public ActionResult<RepositoryResponse<BookingBO>> GetBooking(int id)
        {
            var response = _bookingRepo.GetBookingById(id);
            if (!response.Success)
                return NotFound(response);
            return Ok(response);
        }

        [HttpPost]
        public ActionResult<RepositoryResponse<bool>> AddBooking([FromBody] BookingBO booking)
        {
            var response = _bookingRepo.AddBooking(booking);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpPut("{id}")]
        public ActionResult<RepositoryResponse<bool>> UpdateBooking(int id, [FromBody] BookingBO booking)
        {
            if (id != booking.BookingID)
            {
                return BadRequest(new RepositoryResponse<bool> { Success = false, Message = { "Booking ID mismatch." } });
            }

            var response = _bookingRepo.UpdateBooking(booking);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public ActionResult<RepositoryResponse<bool>> DeleteBooking(int id)
        {
            var response = _bookingRepo.DeleteBooking(id);
            if (!response.Success)
                return NotFound(response);
            return Ok(response);
        }
    }
}

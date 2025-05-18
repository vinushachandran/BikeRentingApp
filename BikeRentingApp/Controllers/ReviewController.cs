using BikeRentingApp.BL;
using BikeRentingApp.Model;
using Microsoft.AspNetCore.Mvc;

namespace BikeRentingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewRepository _repo;

        public ReviewController(ReviewRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("getAllReviews")]
        public IActionResult GetAllReviews()
        {
            var response = _repo.GetAllReviews();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        public IActionResult GetReviewById(int id)
        {
            var response = _repo.GetReviewById(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPost]
        public IActionResult AddReview([FromBody] ReviewBO review)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = _repo.AddReview(review);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}

using BikeRentingApp.BL;
using BikeRentingApp.Model;
using Microsoft.AspNetCore.Mvc;

namespace BikeRentingApp.API.Controllers
{
    [Route("api/bikes")]
    [ApiController]
    public class BikeController : ControllerBase
    {
        private readonly BikeRepository _bikeRepository;

        public BikeController(BikeRepository bikeRepository)
        {
            _bikeRepository = bikeRepository;
        }

       
        [HttpGet]
        public IActionResult GetAllBikes()
        {
            try
            {
                var result = _bikeRepository.GetAllBikes();
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = $"Internal Server Error: {ex.Message}" });
            }
        }

        
        [HttpGet("{id}")]
        public IActionResult GetBikeById(int id)
        {
            try
            {
                var result = _bikeRepository.GetBikeById(id);
                return result.Success ? Ok(result) : NotFound(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = $"Internal Server Error: {ex.Message}" });
            }
        }

        
        [HttpPost("add")]
        public IActionResult AddBike([FromBody] BikeBO bike)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = _bikeRepository.AddBike(bike);
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = $"Internal Server Error: {ex.Message}" });
            }
        }

        
        [HttpPut("update")]
        public IActionResult UpdateBike([FromBody] BikeBO bike)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = _bikeRepository.UpdateBike(bike);
                return result.Success ? Ok(result) : NotFound(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = $"Internal Server Error: {ex.Message}" });
            }
        }

        
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteBike(int id)
        {
            try
            {
                var result = _bikeRepository.DeleteBike(id);
                return result.Success ? Ok(result) : NotFound(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = $"Internal Server Error: {ex.Message}" });
            }
        }

        [HttpGet("search-by-address")]
        public IActionResult SearchBikesByAddress([FromQuery] string query)
        {
            var response = _bikeRepository.SearchBikesByAddress(query);
            if (!response.Success)
                return NotFound(response);

            return Ok(response);
        }
    }
}

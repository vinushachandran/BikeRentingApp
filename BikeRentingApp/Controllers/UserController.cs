using BikeRentingApp.BL.User;
using BikeRentingApp.Data;
using BikeRentingApp.Model.User;
using BikeRentingApp.ViewModel.UserViewModel;
using BTBS.ViewModel.RepositoryResponse;
using Microsoft.AspNetCore.Mvc;

namespace BikeRentingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public UserController(BIkeRentingAppDataContext context, UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public ActionResult<RepositoryResponse<IEnumerable<UserBO>>> GetAll()
        {
            var response = new RepositoryResponse<IEnumerable<UserBO>>();
            try
            {
                response = _userRepository.GetAllUsers();
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
            }
            return Ok(response);
        }

        [HttpGet("{id}")]
        public ActionResult<RepositoryResponse<UserBO>> GetById(int id)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                response = _userRepository.GetUserById(id);
                if (!response.Success || response.Data == null)
                    return NotFound(response);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
                return StatusCode(500, response);
            }

            return Ok(response);
        }

        [HttpPost]
        public ActionResult<RepositoryResponse<UserBO>> Create([FromBody] UserBO user)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                if (!ModelState.IsValid)
                {
                    response.Success = false;
                    response.Message.Add("Invalid data.");
                    return BadRequest(response);
                }

                response = _userRepository.CreateUser(user);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
                return StatusCode(500, response);
            }

            return Ok(response);
        }

        [HttpPut("update")]
        public ActionResult<RepositoryResponse<UserBO>> Update([FromForm] UserUpdateModel user)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                if (user.UserId == null)
                {
                    response.Success = false;
                    response.Message.Add("User ID is null.");
                    return BadRequest(response);
                }

                response = _userRepository.UpdateUser(user);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
                return StatusCode(500, response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public ActionResult<RepositoryResponse<bool>> Delete(int id)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                response = _userRepository.DeleteUser(id);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
                return StatusCode(500, response);
            }

            return Ok(response);
        }

        [HttpPost("login")]
        public ActionResult<RepositoryResponse<UserBO>> Login([FromBody] LoginRequest loginRequest)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
                {
                    response.Success = false;
                    response.Message.Add("Username and password are required.");
                    return BadRequest(response);
                }

                response = _userRepository.Login(loginRequest.Email, loginRequest.Password);

                if (!response.Success)
                    return Unauthorized(response);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
                return StatusCode(500, response);
            }

            return Ok(response);
        }

        [HttpPut("toggle-license/{userId}")]
        public IActionResult ToggleLicenseVerification(int userId)
        {
            var result = _userRepository.ToggleLicenseVerification(userId);
            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }

    }
}

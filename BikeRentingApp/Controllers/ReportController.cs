using BikeRentingApp.BL.Report;
using BikeRentingApp.Model.Report;
using Microsoft.AspNetCore.Mvc;

namespace BikeRentingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly ReportRepository _repo;

        public ReportController(ReportRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("getAllReports")]
        public IActionResult GetAllReport()
        {
            var response = _repo.GetAllReports();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost]
        public IActionResult AddReport([FromBody] ReportBO report)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = _repo.AddReport(report);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}

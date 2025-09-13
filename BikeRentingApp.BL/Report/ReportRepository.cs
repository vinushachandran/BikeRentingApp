using BikeRentingApp.Data;
using BikeRentingApp.Model.Report;
using BTBS.ViewModel.RepositoryResponse;

namespace BikeRentingApp.BL.Report
{
    public class ReportRepository
    {
        private readonly BIkeRentingAppDataContext _context;

        public ReportRepository(BIkeRentingAppDataContext context)
        {
            _context = context;
        }

        public RepositoryResponse<IEnumerable<ReportBO>> GetAllReports()
        {
            var response = new RepositoryResponse<IEnumerable<ReportBO>>();
            try
            {
                var reviews = _context.Report.ToList();
                response.Data = reviews;
                response.Message.Add("Report fetched successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error fetching Report: {ex.Message}");
            }
            return response;
        }

        public RepositoryResponse<bool> AddReport(ReportBO report)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                _context.Report.Add(report);
                _context.SaveChanges();
                response.Data = true;
                response.Message.Add("Report added successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error adding report: {ex.InnerException?.Message ?? ex.Message}");
            }
            return response;
        }
    }
}

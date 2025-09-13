using BikeRentingApp.Data;
using BikeRentingApp.Model;
using BTBS.ViewModel.RepositoryResponse;

namespace BikeRentingApp.BL
{
    public class ReviewRepository
    {
        private readonly BIkeRentingAppDataContext _context;

        public ReviewRepository(BIkeRentingAppDataContext context)
        {
            _context = context;
        }

        public RepositoryResponse<IEnumerable<ReviewBO>> GetAllReviews()
        {
            var response = new RepositoryResponse<IEnumerable<ReviewBO>>();
            try
            {
                var reviews = _context.Reviews.ToList();
                response.Data = reviews;
                response.Message.Add("Reviews fetched successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error fetching reviews: {ex.Message}");
            }
            return response;
        }

        public RepositoryResponse<ReviewBO> GetReviewById(int id)
        {
            var response = new RepositoryResponse<ReviewBO>();
            try
            {
                var review = _context.Reviews.Find(id);
                if (review == null)
                {
                    response.Success = false;
                    response.Message.Add("Review not found.");
                    return response;
                }
                response.Data = review;
                response.Message.Add("Review fetched successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error fetching review: {ex.Message}");
            }
            return response;
        }

        public RepositoryResponse<bool> AddReview(ReviewBO review)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                // Check if Customer and Bike exist
                var customerExists = _context.User.Any(u => u.UserId == review.CustomerID);
                var bikeExists = _context.Bike.Any(b => b.BikeID == review.BikeID);

                if (!customerExists || !bikeExists)
                {
                    response.Success = false;
                    response.Message.Add("Invalid Customer ID or Bike ID.");
                    return response;
                }

                _context.Reviews.Add(review);
                _context.SaveChanges();
                response.Data = true;
                response.Message.Add("Review added successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error adding review: {ex.InnerException?.Message ?? ex.Message}");
            }
            return response;
        }

        public RepositoryResponse<IEnumerable<ReviewBO>> GetReviewByBikeId(int id)
        {
            var response = new RepositoryResponse<IEnumerable<ReviewBO>>();
            try
            {
                var review = _context.Reviews.ToList().Where(s => s.BikeID == id);
                if (review == null)
                {
                    response.Success = false;
                    response.Message.Add("Review not found.");
                    return response;
                }
                response.Data = review;
                response.Message.Add("Review fetched successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error fetching review: {ex.Message}");
            }
            return response;
        }

    }
}

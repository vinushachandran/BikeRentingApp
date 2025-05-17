using BikeRentingApp.Data;
using BikeRentingApp.Model.User;
using BTBS.ViewModel.RepositoryResponse;

namespace BikeRentingApp.BL.User
{
    class UserRepository
    {
        private readonly BIkeRentingAppDataContext _dbContext;
        public UserRepository(BIkeRentingAppDataContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Create
        public RepositoryResponse<UserBO> CreateUser(UserBO user)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                _dbContext.Users.Add(user);
                _dbContext.SaveChanges();
                response.Data = user;
                response.Message.Add("User created successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error: {ex.Message}");
            }

            return response;
        }

        // Read All
        public RepositoryResponse<IEnumerable<UserBO>> GetAllUsers()
        {
            var response = new RepositoryResponse<IEnumerable<UserBO>>();
            try
            {
                var users = _dbContext.Users.ToList();
                response.Data = users;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error: {ex.Message}");
            }
            return response;
        }

        // Read by ID
        public RepositoryResponse<UserBO> GetUserById(long id)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                var user = _dbContext.Users.Find(id);
                if (user != null)
                {
                    response.Data = user;
                }
                else
                {
                    response.Success = false;
                    response.Message.Add("User not found.");
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error: {ex.Message}");
            }
            return response;
        }

        // Update
        public RepositoryResponse<UserBO> UpdateUser(UserBO user)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                var existingUser = _dbContext.Users.Find(user.UserId);
                if (existingUser == null)
                {
                    response.Success = false;
                    response.Message.Add("User not found.");
                    return response;
                }

                // Update properties
                existingUser.FullName = user.FullName;
                existingUser.Email = user.Email;
                existingUser.PasswordHash = user.PasswordHash;
                existingUser.PhoneNumber = user.PhoneNumber;
                existingUser.Role = user.Role;

                _dbContext.SaveChanges();

                response.Data = existingUser;
                response.Message.Add("User updated successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error: {ex.Message}");
            }

            return response;
        }

        // Delete
        public RepositoryResponse<bool> DeleteUser(long id)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                var user = _dbContext.Users.Find(id);
                if (user == null)
                {
                    response.Success = false;
                    response.Message.Add("User not found.");
                    return response;
                }

                _dbContext.Users.Remove(user);
                _dbContext.SaveChanges();

                response.Data = true;
                response.Message.Add("User deleted successfully.");
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Data = false;
                response.Message.Add($"Error: {ex.Message}");
            }

            return response;
        }

    }
}

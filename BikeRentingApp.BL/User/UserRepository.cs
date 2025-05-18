using BikeRentingApp.Data;
using BikeRentingApp.Model.User;
using BikeRentingApp.ViewModel.UserViewModel;
using BTBS.ViewModel.RepositoryResponse;

namespace BikeRentingApp.BL.User
{
    public class UserRepository
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
                // Hash the password
                user.PasswordHash = PasswordHelper.HashPassword(user.PasswordHash);

                _dbContext.User.Add(user);
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
                var users = _dbContext.User.ToList();
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
        public RepositoryResponse<UserBO> GetUserById(int id)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                var user = _dbContext.User.Find(id);
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
        public RepositoryResponse<UserBO> UpdateUser(UserUpdateModel user)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                var existingUser = _dbContext.User.Find(user.UserId);
                if (existingUser == null)
                {
                    response.Success = false;
                    response.Message.Add("User not found.");
                    return response;
                }

                byte[]? imageData = null;
                if (user.LicenseImageFile != null && user.LicenseImageFile.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        user.LicenseImageFile.CopyTo(ms);
                        imageData = ms.ToArray();
                    }
                }

                if (imageData == null)
                {
                    imageData = existingUser.LicenseImage;
                }

                if (user.Password != null)
                {
                    existingUser.PasswordHash = PasswordHelper.HashPassword(user.Password);
                }

                existingUser.Username = user.Username;
                existingUser.Email = user.Email;
                existingUser.PhoneNumber = user.PhoneNumber;
                existingUser.Role = user.Role;
                existingUser.LicenseImage = imageData;

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
        public RepositoryResponse<bool> DeleteUser(int id)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                var user = _dbContext.User.Find(id);
                if (user == null)
                {
                    response.Success = false;
                    response.Message.Add("User not found.");
                    return response;
                }

                _dbContext.User.Remove(user);
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

        // Login
        public RepositoryResponse<UserBO> Login(string email, string password)
        {
            var response = new RepositoryResponse<UserBO>();
            try
            {
                var hashedPassword = PasswordHelper.HashPassword(password);
                var user = _dbContext.User.FirstOrDefault(u => u.Email == email && u.PasswordHash == hashedPassword);

                if (user == null)
                {
                    response.Success = false;
                    response.Message.Add("Invalid email or password.");
                }
                else
                {
                    response.Data = user;
                    response.Message.Add("Login successful.");
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error: {ex.Message}");
            }

            return response;
        }
    }
}

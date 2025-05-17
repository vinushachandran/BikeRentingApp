using BikeRentingApp.Model.User;

namespace BikeRentingApp.ViewModel.UserViewModel
{
    public class UserViewModel
    {
        /// <summary>
        /// All user list
        /// </summary>
        public IEnumerable<UserBO> UserList { get; set; }

        /// <summary>
        /// One User
        /// </summary>
        public UserBO User { get; set; }
    }
}

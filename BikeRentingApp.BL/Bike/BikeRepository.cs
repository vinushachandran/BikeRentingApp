using BikeRentingApp.Data;
using BikeRentingApp.Model;
using BTBS.ViewModel.RepositoryResponse;
using Microsoft.EntityFrameworkCore;

namespace BikeRentingApp.BL
{
    public class BikeRepository
    {
        private readonly BIkeRentingAppDataContext _context;

        public BikeRepository(BIkeRentingAppDataContext context)
        {
            _context = context;
        }

        public RepositoryResponse<IEnumerable<BikeBO>> GetAllBikes()
        {
            var response = new RepositoryResponse<IEnumerable<BikeBO>>();
            try
            {
                response.Data = _context.Bike.Select(b => new BikeBO
                {
                    BikeID = b.BikeID,
                    Type = b.Type,                    
                    RentalPrice = b.RentalPrice,
                    Address = b.Address,
                    AvailabilityStatus = b.AvailabilityStatus,
                    HostID = b.HostID,
                    BikeNumber = b.BikeNumber
                }).ToList();
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
            }
            return response;
        }

        public RepositoryResponse<BikeBO> GetBikeById(int id)
        {
            var response = new RepositoryResponse<BikeBO>();
            try
            {
                var bike = _context.Bike.Find(id);
                if (bike == null)
                {
                    response.Success = false;
                    response.Message.Add("Bike not found");
                }
                else
                {
                    response.Data = new BikeBO
                    {
                        BikeID = bike.BikeID,
                        Type = bike.Type,                       
                        RentalPrice = bike.RentalPrice,
                        Address = bike.Address,
                        AvailabilityStatus = bike.AvailabilityStatus,
                        HostID = bike.HostID,
                        BikeNumber = bike.BikeNumber
                    };
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
            }
            return response;
        }

        public RepositoryResponse<bool> AddBike(BikeBO bikeBO)
        {
            var response = new RepositoryResponse<bool>();
            try
            {
                var existingBike = _context.Bike.FirstOrDefault(b => b.BikeNumber == bikeBO.BikeNumber);
                if (existingBike != null)
                {
                    response.Message.Add($"The bike number '{bikeBO.BikeNumber}' is already in use.");
                    response.Success = false;
                    return response;
                }

                _context.Bike.Add(bikeBO);
                _context.SaveChanges();

                response.Data = true;
                response.Message.Add("Bike added successfully.");
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add($"Error adding bike: {ex.Message}");
                return response;
            }
        }




        public RepositoryResponse<string> UpdateBike(BikeBO bike)
        {
            var response = new RepositoryResponse<string>();
            try
            {
                var existing = _context.Bike.Find(bike.BikeID);
                if (existing == null)
                {
                    response.Success = false;
                    response.Message.Add("Bike not found");
                    return response;
                }

                existing.Type = bike.Type;                
                existing.RentalPrice = bike.RentalPrice;
                existing.AvailabilityStatus = bike.AvailabilityStatus;
                existing.HostID = bike.HostID;
                existing.BikeNumber = bike.BikeNumber;
                existing.Image = bike.Image;

                _context.SaveChanges();
                response.Data = "Bike updated successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
            }
            return response;
        }

        public RepositoryResponse<string> DeleteBike(int id)
        {
            var response = new RepositoryResponse<string>();
            try
            {
                var bike = _context.Bike.Find(id);
                if (bike == null)
                {
                    response.Success = false;
                    response.Message.Add("Bike not found");
                }
                else
                {
                    _context.Bike.Remove(bike);
                    _context.SaveChanges();
                    response.Data = "Bike deleted successfully.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message.Add(ex.Message);
            }
            return response;
        }

        public RepositoryResponse<IEnumerable<BikeBO>> SearchBikesByAddress(string query)
        {
            var response = new RepositoryResponse<IEnumerable<BikeBO>>();
            try
            {
                var bikes = GetAllBikes().Data;

                response.Data = bikes
                    .Where(b => b.Address.ToUpper().Contains(query.ToUpper()))
                    .ToList();

                if (response.Data.Any())
                {
                    response.Message.Add("Bike search by address completed successfully.");
                    return response;
                }
                else
                {
                    response.Success = false;
                    response.Message.Add($"No bikes found for address: '{query}'.");
                    return response;
                }
            }
            catch
            {
                response.Success = false;
                response.Message.Add("An error occurred while searching for bikes by address.");
                return response;
            }
        }


    }
}
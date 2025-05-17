/// <summary>
/// <author>Vinusha</author>
/// <date>22 Febriary 2025</date> 
/// <Purpose>This file implements the repository response class to standardize API responses</Purpose> 
/// </summary>

namespace BTBS.ViewModel.RepositoryResponse
{
    public class RepositoryResponse<T>
    {
        public T? Data { get; set; }

        public bool Success { get; set; } = true;

        public List<string> Message { get; set; } = new List<string>();

        public string TotalMessages
        {
            get
            {
                var msg = "";
                if (Message.Count > 0)
                {

                    foreach (var item in Message)
                    {
                        msg = item.ToString() + "\n";
                    }
                    return msg;
                }
                return msg;
            }
        }

    }
}

using System.Text.Json;
using System.Text;

namespace JoblessAPI.Services
{
    public class ReactClientService
    {
        private readonly HttpClient _httpClient;

        public ReactClientService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> SendDataToReactAppAsync(object data)
        {
            var jsonData = JsonSerializer.Serialize(data);
            var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("http://localhost:3000/api/data", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Failed to send data to React app.");
            }

            return await response.Content.ReadAsStringAsync();
        }
    }
}

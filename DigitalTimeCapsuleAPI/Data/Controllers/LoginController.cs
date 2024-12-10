using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace DigitalTimeCapsuleAPI.Data.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        // POST api/login
        [HttpPost]
        public IActionResult Login([FromHeader] string authorization)
        {
            if (string.IsNullOrEmpty(authorization))
            {
                return Unauthorized(new { message = "Authorization Header not provided" });  // Send JSON response
            }

            var credentials = ValidateBasicAuth(authorization);

            if (credentials.IsValid)
            {
                return Ok(new { message = "Login successful" });  // Send JSON response
            }

            return Unauthorized(new { message = "Invalid credentials" });  // Send JSON response
        }

        private (bool IsValid, string Message) ValidateBasicAuth(string authorization)
        {
            if (!authorization.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
            {
                return (false, "Authorization header is not in Basic format");
            }

            var encodedCredentials = authorization.Substring("Basic ".Length).Trim();
            var decodedCredentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));
            var parts = decodedCredentials.Split(':');

            if (parts.Length != 2)
            {
                return (false, "Invalid Basic Authentication format");
            }

            var username = parts[0];
            var password = parts[1];

            // Replace with actual logic to validate username/password, here we are using hardcoded values
            if (username == "john.doe" && password == "VerySecret!")
            {
                return (true, "Valid credentials");
            }

            return (false, "Invalid credentials");
        }
    }
}


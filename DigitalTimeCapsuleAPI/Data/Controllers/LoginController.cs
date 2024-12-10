using System.Text;
using Microsoft.AspNetCore.Mvc;
 // Adjust the namespace as needed

namespace DigitalTimeCapsuleAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        // Inject UserRepository to access user data from the database
        public LoginController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // POST api/login
        [HttpPost]
        public IActionResult Login([FromHeader] string authorization)
        {
            if (string.IsNullOrEmpty(authorization))
            {
                return Unauthorized(new { message = "Authorization Header not provided" });
            }

            var credentials = ValidateBasicAuth(authorization);

            if (credentials.IsValid)
            {
                // Query the database to find the user by username
                var user = _userRepository.GetAllUsers().FirstOrDefault(u => u.Username == credentials.Username);

                // Check if user exists and if the password matches in plain text
                if (user != null && user.Password == credentials.Password)
                {
                    // Return userId along with success message
                    return Ok(new { message = "Login successful", userId = user.UserID });
                }

                return Unauthorized(new { message = "Invalid credentials" });
            }

            return Unauthorized(new { message = "Invalid authentication format" });
        }

        private (bool IsValid, string Username, string Password) ValidateBasicAuth(string authorization)
        {
            if (!authorization.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
            {
                return (false, null, null);
            }

            var encodedCredentials = authorization.Substring("Basic ".Length).Trim();
            var decodedCredentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));
            var parts = decodedCredentials.Split(':');

            if (parts.Length != 2)
            {
                return (false, null, null);
            }

            var username = parts[0];
            var password = parts[1];

            return (true, username, password);  // Return the username and password
        }
    }
}

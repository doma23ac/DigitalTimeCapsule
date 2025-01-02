using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace DigitalTimeCapsuleAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public LoginController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost]
        public IActionResult Login([FromHeader] string authorization)
        {
            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Basic "))
            {
                return Unauthorized(new { message = "Authorization Header not provided or invalid" });
            }

            var encodedCredentials = authorization.Substring("Basic ".Length).Trim();
            var decodedCredentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));
            var parts = decodedCredentials.Split(':');

            if (parts.Length != 2)
            {
                return Unauthorized(new { message = "Invalid authentication format" });
            }

            var email = parts[0];
            var password = parts[1];

            var user = _userRepository.GetUserByEmail(email);
            if (user != null && user.Password == password)
            {
                return Ok(new
                {
                    message = "Login successful",
                    userId = user.UserID,
                    username = user.Username,
                    email = user.Email
                });
            }

            return Unauthorized(new { message = "Invalid credentials" });
        }
    }
}

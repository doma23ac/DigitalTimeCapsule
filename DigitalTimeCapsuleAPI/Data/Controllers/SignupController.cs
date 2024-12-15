using Microsoft.AspNetCore.Mvc;

using System;

namespace DigitalTimeCapsuleAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignupController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public SignupController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost]
        public IActionResult Signup([FromBody] SignupRequest request)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "All fields are required" });
            }

            // Check if the user already exists
            var existingUsers = _userRepository.GetAllUsers();
            if (existingUsers.Any(u => u.Email == request.Email))
            {
                return Conflict(new { message = "Email is already in use" });
            }
             // Check if the username is already in use
            if (existingUsers.Any(u => u.Username == request.Username))
            {
                return Conflict(new { message = "Username is already in use" });
            }

            // Create and save new user
            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                Password = request.Password, // Save password as plain text
                
            };

            var isInserted = _userRepository.InsertUser(newUser);

            if (isInserted)
            {
                return Ok(new { message = "Signup successful" });
            }

            return StatusCode(500, new { message = "An error occurred while creating the user" });
        }
    }

    // Signup request model
    public class SignupRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

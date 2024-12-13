using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserRepository _userRepository;

    public UsersController(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet("{id}")]
    public IActionResult GetUserById(int id)
    {
        var user = _userRepository.GetUserById(id);
        if (user == null)
        {
            return NotFound($"User with ID {id} not found.");
        }
        return Ok(user);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] User user)
    {
        if (id != user.UserID)
        {
            return BadRequest("User ID mismatch.");
        }

        var existingUser = _userRepository.GetUserById(id);
        if (existingUser == null)
        {
            return NotFound($"User with ID {id} not found.");
        }

        bool result = _userRepository.UpdateUser(user);
        if (result)
        {
            return NoContent();
        }
        return BadRequest("Failed to update user.");
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var existingUser = _userRepository.GetUserById(id);
        if (existingUser == null)
        {
            return NotFound($"User with ID {id} not found.");
        }

        bool result = _userRepository.DeleteUser(id);
        if (result)
        {
            return NoContent();
        }
        return BadRequest("Failed to delete user.");
    }
}


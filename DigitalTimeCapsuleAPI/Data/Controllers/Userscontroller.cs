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

    // GET: api/Users
    [HttpGet]
    public IActionResult GetAllUsers()
    {
        var users = _userRepository.GetAllUsers();
        return Ok(users);
    }

    // GET: api/Users/{id}
    [HttpGet("{id}")]
    public IActionResult GetUser(int id)
    {
        var user = _userRepository.GetUserById(id);
        if (user == null)
        {
            return NotFound($"User with ID {id} not found.");
        }
        return Ok(user);
    }

    // POST: api/Users
    [HttpPost]
    public IActionResult CreateUser([FromBody] User user)
    {
        if (user == null)
        {
            return BadRequest("User data is invalid.");
        }

        bool result = _userRepository.InsertUser(user);
        if (result)
        {
            return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, user);
        }

        return BadRequest("Failed to create user.");
    }

    // PUT: api/Users/{id}
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

    // DELETE: api/Users/{id}
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

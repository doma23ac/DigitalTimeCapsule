using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CapsulesController : ControllerBase
{
    private readonly CapsuleRepository _capsuleRepository;
    private readonly UserRepository _userRepository;

    public CapsulesController(CapsuleRepository capsuleRepository, UserRepository userRepository)
    {
        _capsuleRepository = capsuleRepository;
        _userRepository = userRepository;
    }

    [HttpPost]
    public IActionResult CreateCapsule([FromBody] Capsule capsule)
    {
        if (capsule == null || string.IsNullOrEmpty(capsule.SenderUsername))
        {
            return BadRequest("Invalid capsule data.");
        }

        // Resolve SenderID
        var sender = _userRepository.GetUserByUsername(capsule.SenderUsername);
        if (sender == null)
        {
            return NotFound($"Sender username '{capsule.SenderUsername}' not found.");
        }
        capsule.SenderID = sender.UserID;

        // Resolve RecipientID 
        if (!string.IsNullOrEmpty(capsule.RecipientUsername))
        {
            var recipient = _userRepository.GetUserByUsername(capsule.RecipientUsername);
            if (recipient == null)
            {
                return NotFound($"Recipient username '{capsule.RecipientUsername}' not found.");
            }
            capsule.RecipientID = recipient.UserID;
        }

        // Save capsule
        bool result = _capsuleRepository.InsertCapsule(capsule);

        if (result && capsule.CapsuleID > 0)
        {
            // Return the created capsule with its ID
            return CreatedAtAction(nameof(GetCapsuleById), new { id = capsule.CapsuleID }, capsule);
        }

        return BadRequest("Failed to create capsule.");
    }

    [HttpGet("{id}")]
    public IActionResult GetCapsuleById(int id)
    {
        var capsule = _capsuleRepository.GetCapsuleById(id);
        if (capsule == null)
        {
            return NotFound($"Capsule with ID {id} not found.");
        }
        return Ok(capsule);
    }

    [HttpGet]
    public IActionResult GetAllCapsules()
    {
        var capsules = _capsuleRepository.GetAllCapsules();
        return Ok(capsules);
    }

   

    [HttpDelete("{id}")]
    public IActionResult DeleteCapsule(int id)
    {
        var existingCapsule = _capsuleRepository.GetCapsuleById(id);
        if (existingCapsule == null)
        {
            return NotFound($"Capsule with ID {id} not found.");
        }

        bool result = _capsuleRepository.DeleteCapsule(id);
        if (result)
        {
            return NoContent();
        }

        return BadRequest("Failed to delete capsule.");
    }
}

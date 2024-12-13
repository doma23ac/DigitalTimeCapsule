using Microsoft.AspNetCore.Mvc;
using System;

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

        // Resolve RecipientID (optional)
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
        if (result)
        {
            return CreatedAtAction(nameof(CreateCapsule), new { id = capsule.CapsuleID }, capsule);
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

    [HttpPut("{id}")]
    public IActionResult UpdateCapsule(int id, [FromBody] Capsule capsule)
    {
        if (id != capsule.CapsuleID)
        {
            return BadRequest("Capsule ID mismatch.");
        }

        var existingCapsule = _capsuleRepository.GetCapsuleById(id);
        if (existingCapsule == null)
        {
            return NotFound($"Capsule with ID {id} not found.");
        }

        // Update logic
        bool result = _capsuleRepository.UpdateCapsule(capsule);
        if (result)
        {
            return NoContent();
        }

        return BadRequest("Failed to update capsule.");
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

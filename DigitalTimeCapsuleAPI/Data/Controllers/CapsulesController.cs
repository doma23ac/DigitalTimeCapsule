using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class CapsulesController : ControllerBase
{
    private readonly CapsuleRepository _capsuleRepository;

    public CapsulesController(CapsuleRepository capsuleRepository)
    {
        _capsuleRepository = capsuleRepository;
    }

    // GET: api/Capsules
    [HttpGet]
    public IActionResult GetAllCapsules()
    {
        var capsules = _capsuleRepository.GetAllCapsules();
        return Ok(capsules);
    }

    // GET: api/Capsules/{id}
    [HttpGet("{id}")]
    public IActionResult GetCapsule(int id)
    {
        var capsule = _capsuleRepository.GetCapsuleById(id);
        if (capsule == null)
        {
            return NotFound($"Capsule with ID {id} not found.");
        }
        return Ok(capsule);
    }

    // POST: api/Capsules
    [HttpPost]
    public IActionResult CreateCapsule([FromBody] Capsule capsule)
    {
        if (capsule == null)
        {
            return BadRequest("Capsule data is invalid.");
        }

        bool result = _capsuleRepository.InsertCapsule(capsule);
        if (result)
        {
            return CreatedAtAction(nameof(GetCapsule), new { id = capsule.CapsuleID }, capsule);
        }

        return BadRequest("Failed to create capsule.");
    }

    // PUT: api/Capsules/{id}
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

        bool result = _capsuleRepository.UpdateCapsule(capsule);
        if (result)
        {
            return NoContent();
        }

        return BadRequest("Failed to update capsule.");
    }

    // DELETE: api/Capsules/{id}
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

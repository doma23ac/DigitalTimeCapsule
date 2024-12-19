using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class CapsuleTagsController : ControllerBase
{
    private readonly CapsuleTagRepository _capsuleTagRepository;
    private readonly CapsuleRepository _capsuleRepository;
    private readonly TagRepository _tagRepository;

    public CapsuleTagsController(
        CapsuleTagRepository capsuleTagRepository,
        CapsuleRepository capsuleRepository,
        TagRepository tagRepository)
    {
        _capsuleTagRepository = capsuleTagRepository;
        _capsuleRepository = capsuleRepository;
        _tagRepository = tagRepository;
    }

    // GET: api/CapsuleTags/{capsuleId}
    [HttpGet("{capsuleId}")]
    public IActionResult GetTagsForCapsule(int capsuleId)
    {
        var tags = _capsuleTagRepository.GetTagsByCapsuleId(capsuleId);
        if (tags == null || tags.Count == 0)
        {
            return NotFound($"No tags found for Capsule with ID {capsuleId}.");
        }
        return Ok(tags);
    }
 // POST: api/CapsuleTags/{capsuleId}/{tagId}
    [HttpPost("{capsuleId}/{tagId}")]
    public IActionResult AddTagToCapsule(int capsuleId, int tagId)
    {
        // Validate that the capsule exists
        var capsule = _capsuleRepository.GetCapsuleById(capsuleId);
        if (capsule == null)
        {
            return NotFound($"Capsule with ID {capsuleId} not found.");
        }

        // Validate that the tag exists
        var tag = _tagRepository.GetTagById(tagId);
        if (tag == null)
        {
            return NotFound($"Tag with ID {tagId} not found.");
        }

        // Add the tag to the capsule
        var result = _capsuleTagRepository.AddTagToCapsule(capsuleId, tagId);
        if (!result)
        {
            return BadRequest("Failed to add the tag to the capsule.");
        }

        return Ok($"Tag with ID {tagId} successfully added to Capsule with ID {capsuleId}.");
    }



}

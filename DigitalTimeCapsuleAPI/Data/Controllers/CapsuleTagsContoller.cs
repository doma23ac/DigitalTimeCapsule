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

}

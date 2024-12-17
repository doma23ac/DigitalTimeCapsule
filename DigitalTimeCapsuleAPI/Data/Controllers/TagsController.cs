using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly TagRepository _tagRepository;

    public TagsController(TagRepository tagRepository)
    {
        _tagRepository = tagRepository;
    }

    // GET: api/Tags
    [HttpGet]
    public IActionResult GetAllTags()
    {
        var tags = _tagRepository.GetAllTags();
        return Ok(tags);
    }

    // GET: api/Tags/{id}
    [HttpGet("{id}")]
    public IActionResult GetTag(int id)
    {
        var tag = _tagRepository.GetTagById(id);
        if (tag == null)
        {
            return NotFound($"Tag with ID {id} not found.");
        }
        return Ok(tag);
    }

}

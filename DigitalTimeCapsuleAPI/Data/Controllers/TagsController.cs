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

    // POST: api/Tags
    [HttpPost]
    public IActionResult CreateTag([FromBody] Tag tag)
    {
        if (tag == null)
        {
            return BadRequest("Tag data is invalid.");
        }

        bool result = _tagRepository.InsertTag(tag);
        if (result)
        {
            return CreatedAtAction(nameof(GetTag), new { id = tag.TagID }, tag);
        }

        return BadRequest("Failed to create tag.");
    }

    // PUT: api/Tags/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateTag(int id, [FromBody] Tag tag)
    {
        if (id != tag.TagID)
        {
            return BadRequest("Tag ID mismatch.");
        }

        var existingTag = _tagRepository.GetTagById(id);
        if (existingTag == null)
        {
            return NotFound($"Tag with ID {id} not found.");
        }

        bool result = _tagRepository.UpdateTag(tag);
        if (result)
        {
            return NoContent();
        }

        return BadRequest("Failed to update tag.");
    }

    // DELETE: api/Tags/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteTag(int id)
    {
        var existingTag = _tagRepository.GetTagById(id);
        if (existingTag == null)
        {
            return NotFound($"Tag with ID {id} not found.");
        }

        bool result = _tagRepository.DeleteTag(id);
        if (result)
        {
            return NoContent();
        }

        return BadRequest("Failed to delete tag.");
    }
}

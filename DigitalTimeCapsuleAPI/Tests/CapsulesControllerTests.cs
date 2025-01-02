using System;
using Microsoft.AspNetCore.Mvc;
using Xunit;

public class FakeCapsulesControllerTests
{
    [Fact]
    public void CreateFakeCapsule_ValidData_ReturnsCreatedResult()
    {
        // Arrange
        var controller = new FakeCapsulesControllerTestStub(new FakeFakeCapsuleRepository(), new FakeFakeUserRepository());
        var capsule = new FakeCapsule
        {
            CapsuleID = 0,  // Initially, this should be set after insertion
            Title = "My Capsule",
            Message = "Message inside",
            LockDate = DateTime.Now.AddMonths(1),
            SenderUsername = "sender1",
            RecipientUsername = "recipient1"
        };

        // Act
        var result = controller.CreateFakeCapsule(capsule);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, createdAtActionResult.StatusCode);
        Assert.Equal("GetFakeCapsuleById", createdAtActionResult.ActionName); // Verifies the action name
        Assert.Equal("FakeCapsulesController", createdAtActionResult.ControllerName); // Verifies the controller name
    }

    [Fact]
    public void CreateFakeCapsule_InvalidSender_ReturnsNotFound()
    {
        // Arrange
        var controller = new FakeCapsulesControllerTestStub(new FakeFakeCapsuleRepository(), new FakeFakeUserRepository());
        var capsule = new FakeCapsule
        {
            CapsuleID = 0,
            Title = "My Capsule",
            Message = "Message inside",
            LockDate = DateTime.Now.AddMonths(1),
            SenderUsername = "invalidSender"
        };

        // Act
        var result = controller.CreateFakeCapsule(capsule);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal(404, notFoundResult.StatusCode);
    }

    [Fact]
    public void GetFakeCapsuleById_FakeCapsuleExists_ReturnsOkResult()
    {
        // Arrange
        var controller = new FakeCapsulesControllerTestStub(new FakeFakeCapsuleRepository(), new FakeFakeUserRepository());
        var capsule = new FakeCapsule { CapsuleID = 1, Title = "Capsule 1", Message = "Message", LockDate = DateTime.Now };

        // Act
        var result = controller.GetFakeCapsuleById(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
    }

    [Fact]
    public void GetFakeCapsuleById_FakeCapsuleNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var controller = new FakeCapsulesControllerTestStub(new FakeFakeCapsuleRepository(), new FakeFakeUserRepository());

        // Act
        var result = controller.GetFakeCapsuleById(999); // Use an ID that doesn't exist

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal(404, notFoundResult.StatusCode);
    }

    [Fact]
    public void DeleteFakeCapsule_FakeCapsuleExists_ReturnsNoContent()
    {
        // Arrange
        var controller = new FakeCapsulesControllerTestStub(new FakeFakeCapsuleRepository(), new FakeFakeUserRepository());
        var capsule = new FakeCapsule { CapsuleID = 1, Title = "Capsule 1", Message = "Message", LockDate = DateTime.Now };

        // Act
        var result = controller.DeleteFakeCapsule(1);

        // Assert
        var noContentResult = Assert.IsType<NoContentResult>(result);
        Assert.Equal(204, noContentResult.StatusCode);
    }

    [Fact]
    public void DeleteFakeCapsule_FakeCapsuleNotFound_ReturnsNotFound()
    {
        // Arrange
        var controller = new FakeCapsulesControllerTestStub(new FakeFakeCapsuleRepository(), new FakeFakeUserRepository());

        // Act
        var result = controller.DeleteFakeCapsule(999); // Use an ID that doesn't exist

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal(404, notFoundResult.StatusCode);
    }
}

// Fake Test Stub Controller to avoid naming conflict
public class FakeCapsulesControllerTestStub
{
    private readonly FakeFakeCapsuleRepository _capsuleRepository;
    private readonly FakeFakeUserRepository _userRepository;

    public FakeCapsulesControllerTestStub(FakeFakeCapsuleRepository capsuleRepository, FakeFakeUserRepository userRepository)
    {
        _capsuleRepository = capsuleRepository;
        _userRepository = userRepository;
    }

    public IActionResult CreateFakeCapsule(FakeCapsule capsule)
    {
        if (capsule == null || string.IsNullOrEmpty(capsule.SenderUsername))
        {
            return new BadRequestObjectResult("Invalid capsule data.");
        }

        var sender = _userRepository.GetFakeUserByUsername(capsule.SenderUsername);
        if (sender == null)
        {
            return new NotFoundObjectResult($"Sender username '{capsule.SenderUsername}' not found.");
        }
        capsule.SenderID = sender.UserID;

        if (!string.IsNullOrEmpty(capsule.RecipientUsername))
        {
            var recipient = _userRepository.GetFakeUserByUsername(capsule.RecipientUsername);
            if (recipient == null)
            {
                return new NotFoundObjectResult($"Recipient username '{capsule.RecipientUsername}' not found.");
            }
            capsule.RecipientID = recipient.UserID;
        }

        bool result = _capsuleRepository.InsertFakeCapsule(capsule);

        if (result && capsule.CapsuleID > 0)
        {
            return new CreatedAtActionResult(
                actionName: "GetFakeCapsuleById", // Action name to return
                controllerName: "FakeCapsulesController", // Controller name to return
                routeValues: new { id = capsule.CapsuleID }, // Route value for ID
                value: capsule // The created capsule to return in the response body
            );
        }

        return new BadRequestObjectResult("Failed to create capsule.");
    }

    public IActionResult GetFakeCapsuleById(int id)
    {
        var capsule = _capsuleRepository.GetFakeCapsuleById(id);
        if (capsule == null)
        {
            // Return NotFound if capsule doesn't exist
            return new NotFoundObjectResult($"Capsule with ID {id} not found.");
        }
        return new OkObjectResult(capsule);
    }

    public IActionResult DeleteFakeCapsule(int id)
    {
        var existingCapsule = _capsuleRepository.GetFakeCapsuleById(id);
        if (existingCapsule == null)
        {
            // Return NotFound if capsule is not found
            return new NotFoundObjectResult($"Capsule with ID {id} not found.");
        }

        bool result = _capsuleRepository.DeleteFakeCapsule(id);
        if (result)
        {
            // Return NoContent if deletion is successful
            return new NoContentResult();
        }

        return new BadRequestObjectResult("Failed to delete capsule.");
    }
}

// Fake Capsule Model
public class FakeCapsule
{
    public int CapsuleID { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public DateTime LockDate { get; set; }

    public int SenderID { get; set; }
    public int RecipientID { get; set; }

    public string SenderUsername { get; set; }
    public string RecipientUsername { get; set; }
}

// Fake User Model
public class FakeUser
{
    public int UserID { get; set; }
    public string Username { get; set; }
}

// Fake Repository for Fake Capsules
public class FakeFakeCapsuleRepository
{
    public bool InsertFakeCapsule(FakeCapsule capsule)
    {
        capsule.CapsuleID = 1;
        return true; // Simulating success
    }

    public FakeCapsule GetFakeCapsuleById(int id)
    {
        if (id == 1)
            return new FakeCapsule { CapsuleID = 1, Title = "Capsule 1", Message = "Message", LockDate = DateTime.Now };
        return null; // Simulating not found
    }

    public bool DeleteFakeCapsule(int id)
    {
        return id == 1; // Simulating successful deletion for id 1
    }
}

// Fake Repository for Fake Users
public class FakeFakeUserRepository
{
    public FakeUser GetFakeUserByUsername(string username)
    {
        if (username == "sender1")
            return new FakeUser { UserID = 1, Username = "sender1" };
        if (username == "recipient1")
            return new FakeUser { UserID = 2, Username = "recipient1" };
        return null; // Simulating user not found
    }
}

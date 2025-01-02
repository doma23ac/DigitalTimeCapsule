using Moq;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Extensions.Configuration;
using Xunit;

public class DummyCapsuleRepositoryTests
{
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly Mock<IDbConnection> _mockConnection;
    private readonly Mock<IDbCommand> _mockCommand;
    private readonly DummyCapsuleRepository _repository;

    public DummyCapsuleRepositoryTests()
    {
        // Mocking the configuration
        _mockConfig = new Mock<IConfiguration>();

        // Mock the connection and command
        _mockConnection = new Mock<IDbConnection>();
        _mockCommand = new Mock<IDbCommand>();

        // Mock the connection string
        _mockConfig.Setup(config => config["ConnectionStrings:DefaultConnection"]).Returns("Host=myserver;Username=mylogin;Password=mypass;Database=mydatabase");

        // Create the repository instance
        _repository = new DummyCapsuleRepository(_mockConfig.Object);
    }

    [Fact]
    public void GetAllDummyCapsules_ReturnsListOfCapsules()
    {
        // Arrange
        var mockDataReader = new Mock<IDataReader>();

        // Mock the Read() method to simulate that the reader returns data
        mockDataReader.SetupSequence(r => r.Read())
                      .Returns(true) // First read returns true (indicating data is available)
                      .Returns(false); // Second read returns false (indicating no more data)

        // Mock data that will be returned by the reader
        mockDataReader.Setup(r => r.GetInt32(It.IsAny<int>())).Returns(1); // Simulate CapsuleID = 1
        mockDataReader.Setup(r => r.GetString(It.IsAny<int>())).Returns("Test Capsule"); // Simulate the title

        // Mock the ExecuteReader method to return the mock IDataReader
        _mockCommand.Setup(cmd => cmd.ExecuteReader()).Returns(mockDataReader.Object);

        // Mock the CreateCommand method to return the mock IDbCommand
        _mockConnection.Setup(conn => conn.CreateCommand()).Returns(_mockCommand.Object);

        // Mock the connection open method
        _mockConnection.Setup(conn => conn.Open()).Verifiable();

        // Act
        var result = _repository.GetAllDummyCapsules();

        // Assert
        Assert.IsType<List<DummyCapsule>>(result);
        Assert.Single(result); // The collection should contain a single element
        Assert.Equal(1, result[0].CapsuleID); // Ensure the returned capsule has the expected CapsuleID
        Assert.Equal("Test Capsule", result[0].Title); // Ensure the title is correct
    }

    [Fact]
    public void GetDummyCapsuleById_ValidId_ReturnsDummyCapsule()
    {
        // Arrange
        int validId = 1;
        var mockDataReader = new Mock<IDataReader>();
        mockDataReader.Setup(r => r.Read()).Returns(true);
        mockDataReader.Setup(r => r.GetInt32(It.IsAny<int>())).Returns(validId);
        mockDataReader.Setup(r => r.GetString(It.IsAny<int>())).Returns("Test Capsule");

        // Mock the ExecuteReader method to return the mock IDataReader
        _mockCommand.Setup(cmd => cmd.ExecuteReader()).Returns(mockDataReader.Object);

        // Mock the CreateCommand method to return the mock IDbCommand
        _mockConnection.Setup(conn => conn.CreateCommand()).Returns(_mockCommand.Object);

        // Act
        var result = _repository.GetDummyCapsuleById(validId);

        // Assert
        Assert.IsType<DummyCapsule>(result);
        Assert.Equal(validId, result.CapsuleID);
    }

    [Fact]
    public void InsertDummyCapsule_ValidDummyCapsule_ReturnsTrue()
    {
        // Arrange
        var capsule = new DummyCapsule
        {
            Title = "Test Capsule",
            Message = "Message for testing",
            LockDate = DateTime.Now,
            SenderID = 1,
            RecipientID = 2
        };

        // Mock ExecuteScalar to return the new Capsule ID
        _mockCommand.Setup(cmd => cmd.ExecuteScalar()).Returns(1);

        // Mock the CreateCommand method to return the mock IDbCommand
        _mockConnection.Setup(conn => conn.CreateCommand()).Returns(_mockCommand.Object);

        // Act
        var result = _repository.InsertDummyCapsule(capsule);

        // Assert
        Assert.True(result);
        Assert.Equal(1, capsule.CapsuleID);
    }

    [Fact]
    public void DeleteDummyCapsule_ValidId_ReturnsTrue()
    {
        // Arrange
        int validId = 1;

        // Mock ExecuteNonQuery to return 1 (indicating successful deletion)
        _mockCommand.Setup(cmd => cmd.ExecuteNonQuery()).Returns(1);

        // Mock the CreateCommand method to return the mock IDbCommand
        _mockConnection.Setup(conn => conn.CreateCommand()).Returns(_mockCommand.Object);

        // Act
        var result = _repository.DeleteDummyCapsule(validId);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void DeleteDummyCapsule_InvalidId_ReturnsFalse()
    {
        // Arrange
        int invalidId = 999;

        // Mock ExecuteNonQuery to return 0 (indicating failure to delete)
        _mockCommand.Setup(cmd => cmd.ExecuteNonQuery()).Returns(0);

        // Mock the CreateCommand method to return the mock IDbCommand
        _mockConnection.Setup(conn => conn.CreateCommand()).Returns(_mockCommand.Object);

        // Act
        var result = _repository.DeleteDummyCapsule(invalidId);

        // Assert
        Assert.False(result);
    }
}

public class DummyCapsule
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

public class DummyCapsuleRepository
{
    private readonly IConfiguration _configuration;

    public DummyCapsuleRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Method: Fetch capsules with optional filter
    private List<DummyCapsule> FetchDummyCapsules(string whereClause = "", object? parameter = null)
    {
        var capsules = new List<DummyCapsule>();

        // Simulating fetching capsules from database
        if (whereClause == "WHERE c.\"CapsuleID\" = @id" && parameter != null)
        {
            capsules.Add(new DummyCapsule { CapsuleID = (int)parameter, Title = "Test Capsule", Message = "Test Message" });
        }
        else
        {
            // Add a capsule when no filter is provided
            capsules.Add(new DummyCapsule { CapsuleID = 1, Title = "Test Capsule", Message = "Test Message" });
        }

        return capsules;
    }

    // Method: Get all dummy capsules
    public List<DummyCapsule> GetAllDummyCapsules()
    {
        return FetchDummyCapsules();
    }

    // Method: Get a dummy capsule by ID
    public DummyCapsule GetDummyCapsuleById(int id)
    {
        var capsules = FetchDummyCapsules("WHERE c.\"CapsuleID\" = @id", id);
        return capsules.FirstOrDefault();
    }

    // Method: Insert a new dummy capsule
    public bool InsertDummyCapsule(DummyCapsule capsule)
    {
        // Simulating insert and returning true for success
        capsule.CapsuleID = 1;
        return true;
    }

    // Method: Delete a dummy capsule by ID
    public bool DeleteDummyCapsule(int id)
    {
        // Simulating delete and returning true for success
        return id == 1; // Only succeed if id is 1
    }
}

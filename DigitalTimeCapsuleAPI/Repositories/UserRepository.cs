using Npgsql;
using System.Collections.Generic;

public class UserRepository : BaseRepository
{
    public UserRepository(IConfiguration configuration) : base(configuration) { }

    // Fetch all users
    public List<User> GetAllUsers()
    {
        var users = new List<User>();
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM \"Users\"";

        var reader = GetData(conn, cmd);
        while (reader.Read())
        {
            users.Add(new User
            {
                UserID = (int)reader["UserID"],
                Username = reader["Username"].ToString(),
                Email = reader["Email"].ToString(),
                Password = reader["Password"].ToString()
            });
        }
        return users;
    }

    // Fetch user by email
    public User? GetUserByEmail(string email)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM \"Users\" WHERE \"Email\" = @Email";
        cmd.Parameters.AddWithValue("@Email", email);

        var reader = GetData(conn, cmd);
        if (reader.Read())
        {
            return new User
            {
                UserID = (int)reader["UserID"],
                Username = reader["Username"].ToString(),
                Email = reader["Email"].ToString(),
                Password = reader["Password"].ToString()
            };
        }
        return null;
    }

    // Insert a new user
    public bool InsertUser(User user)
{
    using var conn = new NpgsqlConnection(ConnectionString);
    var cmd = conn.CreateCommand();

    // Correct SQL query
    cmd.CommandText = "INSERT INTO \"Users\" (\"Username\", \"Email\", \"Password\") " +
                  "VALUES (@username, @email, @password)";

    
    // Add Parameters
    cmd.Parameters.AddWithValue("@username", user.Username);
    cmd.Parameters.AddWithValue("@email", user.Email);
    cmd.Parameters.AddWithValue("@password", user.Password ?? (object)DBNull.Value);

    return ExecuteCommand(conn, cmd);
}



    // Fetch user by ID
    public User? GetUserById(int userId)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM \"Users\" WHERE \"UserID\" = @userId";
        cmd.Parameters.AddWithValue("@userId", userId);

        var reader = GetData(conn, cmd);
        if (reader.Read())
        {
            return new User
            {
                UserID = (int)reader["UserID"],
                Username = reader["Username"].ToString(),
                Email = reader["Email"].ToString(),
                Password = reader["Password"].ToString()
            };
        }
        return null;
    }

    // Fetch user by username
    public User? GetUserByUsername(string username)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM \"Users\" WHERE \"Username\" = @username";
        cmd.Parameters.AddWithValue("@username", username);

        var reader = GetData(conn, cmd);
        if (reader.Read())
        {
            return new User
            {
                UserID = (int)reader["UserID"],
                Username = reader["Username"].ToString(),
                Email = reader["Email"].ToString(),
                Password = reader["Password"].ToString()
            };
        }
        return null;
    }

    // Update an existing user
    public bool UpdateUser(User user)
{
    using var conn = new NpgsqlConnection(ConnectionString);
    var cmd = conn.CreateCommand();

    // Correct SQL Command
    cmd.CommandText = @"
        UPDATE ""Users"" SET
            ""Username"" = @username,
            ""Email"" = @email,
            ""Password"" = @password
        WHERE ""UserID"" = @userId";

    // Add Parameters
    cmd.Parameters.AddWithValue("@username", user.Username);
    cmd.Parameters.AddWithValue("@password", user.Password ?? (object)DBNull.Value); // Handle nullable Password
    cmd.Parameters.AddWithValue("@email", user.Email);
    cmd.Parameters.AddWithValue("@userId", user.UserID);

    // Execute the Command
    return ExecuteCommand(conn, cmd);
}


    // Delete a user
    public bool DeleteUser(int userId)
{
    using var conn = new NpgsqlConnection(ConnectionString);
    conn.Open();

    using var transaction = conn.BeginTransaction(); // Begin a transaction
    try
    {
        // Step 1: Delete rows in capsuletags associated with the user's capsules
        using (var deleteCapsuleTagsCmd = conn.CreateCommand())
        {
            deleteCapsuleTagsCmd.CommandText = @"
                DELETE FROM ""capsuletags""
                WHERE ""capsuleid"" IN (
                    SELECT ""CapsuleID""
                    FROM ""Capsules""
                    WHERE ""SenderId"" = @userId
                )";
            deleteCapsuleTagsCmd.Parameters.AddWithValue("@userId", userId);
            deleteCapsuleTagsCmd.Transaction = transaction;
            deleteCapsuleTagsCmd.ExecuteNonQuery();
        }
        using (var deleteRecipientCapsulesCmd = conn.CreateCommand())
{
    deleteRecipientCapsulesCmd.CommandText = @"
        DELETE FROM ""Capsules""
        WHERE ""RecipientID"" = @userId";
    deleteRecipientCapsulesCmd.Parameters.AddWithValue("@userId", userId);
    deleteRecipientCapsulesCmd.Transaction = transaction;
    deleteRecipientCapsulesCmd.ExecuteNonQuery();
}


        // Step 2: Delete rows in Capsules associated with the user
        using (var deleteCapsulesCmd = conn.CreateCommand())
        {
            deleteCapsulesCmd.CommandText = @"
                DELETE FROM ""Capsules""
                WHERE ""SenderId"" = @userId";
            deleteCapsulesCmd.Parameters.AddWithValue("@userId", userId);
            deleteCapsulesCmd.Transaction = transaction;
            deleteCapsulesCmd.ExecuteNonQuery();
        }

        // Step 3: Delete the user
        using (var deleteUserCmd = conn.CreateCommand())
        {
            deleteUserCmd.CommandText = @"
                DELETE FROM ""Users""
                WHERE ""UserID"" = @userId";
            deleteUserCmd.Parameters.AddWithValue("@userId", userId);
            deleteUserCmd.Transaction = transaction;
            deleteUserCmd.ExecuteNonQuery();
        }

        transaction.Commit(); // Commit the transaction
        return true; // Deletion successful
    }
    catch (Exception ex)
    {
        transaction.Rollback(); // Rollback on error
        Console.Error.WriteLine($"Error deleting user: {ex.Message}");
        throw; // Re-throw exception for further handling
    }
}

}


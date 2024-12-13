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
        var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM \"Users\" WHERE \"UserID\" = @userId";
        cmd.Parameters.AddWithValue("@userId", userId);

        return ExecuteCommand(conn, cmd);
    }
}


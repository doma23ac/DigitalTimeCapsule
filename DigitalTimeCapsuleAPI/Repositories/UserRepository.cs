using Npgsql;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;

public class UserRepository : BaseRepository
{
    public UserRepository(IConfiguration configuration) : base(configuration) { }

    // Get all users
    public List<User> GetAllUsers()
    {
        var users = new List<User>();

        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Users";

        var reader = GetData(conn, cmd);
        while (reader.Read())
        {
            users.Add(new User
            {
                UserID = (int)reader["UserID"],
                Username = reader["Username"].ToString(),
                Email = reader["Email"].ToString(),
                Password = reader["Password"].ToString(),
                ProfilePicture = reader["ProfilePicture"].ToString()
            });
        }

        return users;
    }

    // Get a single user by ID
    public User GetUserById(int id)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Users WHERE UserID = @id";
        cmd.Parameters.AddWithValue("@id", id);

        var reader = GetData(conn, cmd);
        if (reader.Read())
        {
            return new User
            {
                UserID = (int)reader["UserID"],
                Username = reader["Username"].ToString(),
                Email = reader["Email"].ToString(),
                Password = reader["Password"].ToString(),
                ProfilePicture = reader["ProfilePicture"].ToString()
            };
        }
        return null;
    }

    // Insert a new user
    public bool InsertUser(User user)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO Users (Username, Email, Password, ProfilePicture) 
            VALUES (@username, @email, @password, @profilePicture)";
        cmd.Parameters.AddWithValue("@username", user.Username);
        cmd.Parameters.AddWithValue("@email", user.Email);
        cmd.Parameters.AddWithValue("@password", user.Password);
        cmd.Parameters.AddWithValue("@profilePicture", user.ProfilePicture);

        return ExecuteCommand(conn, cmd);
    }

    // Update an existing user
    public bool UpdateUser(User user)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            UPDATE Users SET 
                Username = @username,
                Email = @email,
                Password = @password,
                ProfilePicture = @profilePicture
            WHERE UserID = @userID";
        cmd.Parameters.AddWithValue("@username", user.Username);
        cmd.Parameters.AddWithValue("@email", user.Email);
        cmd.Parameters.AddWithValue("@password", user.Password);
        cmd.Parameters.AddWithValue("@profilePicture", user.ProfilePicture);
        cmd.Parameters.AddWithValue("@userID", user.UserID);

        return ExecuteCommand(conn, cmd);
    }

    // Delete a user by ID
    public bool DeleteUser(int id)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM Users WHERE UserID = @id";
        cmd.Parameters.AddWithValue("@id", id);

        return ExecuteCommand(conn, cmd);
    }
}

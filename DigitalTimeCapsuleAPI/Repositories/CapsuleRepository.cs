using Npgsql;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;

public class CapsuleRepository : BaseRepository
{
    public CapsuleRepository(IConfiguration configuration) : base(configuration) { }

    public Capsule? GetCapsuleById(int id)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM \"Capsules\" WHERE \"CapsuleID\" = @id";
        cmd.Parameters.AddWithValue("@id", id);

        var reader = GetData(conn, cmd);
        if (reader.Read())
        {
            return new Capsule
            {
                CapsuleID = (int)reader["CapsuleID"],
                Title = reader["Title"]?.ToString() ?? string.Empty,
                Message = reader["Message"]?.ToString() ?? string.Empty,
                LockDate = reader["LockDate"] is DBNull ? DateTime.MinValue : (DateTime)reader["LockDate"],
                Status = reader["Status"]?.ToString() ?? string.Empty,
                SenderID = (int)reader["SenderID"],
                RecipientID = reader["RecipientID"] as int?
            };
        }
        return null;
    }

    public bool InsertCapsule(Capsule capsule)
{
    using var conn = new NpgsqlConnection(ConnectionString);
    conn.Open();

    var cmd = conn.CreateCommand();
    cmd.CommandText = @"
        INSERT INTO ""Capsules"" (
            ""Title"", 
            ""Message"", 
            ""LockDate"", 
            ""Status"", 
            ""SenderId"", 
            ""RecipientID""
        ) 
        VALUES (
            @title, 
            @message, 
            @lockDate, 
            @status, 
            @senderID, 
            @recipientID
        )
        RETURNING ""CapsuleID"";"; // Return the CapsuleID of the newly inserted row

    cmd.Parameters.AddWithValue("@title", capsule.Title ?? string.Empty);
    cmd.Parameters.AddWithValue("@message", capsule.Message ?? string.Empty);
    cmd.Parameters.AddWithValue("@lockDate", capsule.LockDate);
    cmd.Parameters.AddWithValue("@status", capsule.Status ?? string.Empty);
    cmd.Parameters.AddWithValue("@senderID", capsule.SenderID);
    cmd.Parameters.AddWithValue("@recipientID", (object?)capsule.RecipientID ?? DBNull.Value);

    // Retrieve the CapsuleID and set it to the capsule object
    capsule.CapsuleID = (int)cmd.ExecuteScalar();

    return true;
}


    public bool UpdateCapsule(Capsule capsule)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = cmd.CommandText = @"
    UPDATE ""Capsules"" 
    SET 
        ""Title"" = @title,
        ""Message"" = @message,
        ""LockDate"" = @lockDate,
        ""Status"" = @status,
        ""SenderId"" = @senderID,
        ""RecipientID"" = @recipientID
    WHERE 
        ""CapsuleID"" = @capsuleID";

        cmd.Parameters.AddWithValue("@title", capsule.Title ?? string.Empty);
        cmd.Parameters.AddWithValue("@message", capsule.Message ?? string.Empty);
        cmd.Parameters.AddWithValue("@lockDate", capsule.LockDate);
        cmd.Parameters.AddWithValue("@status", capsule.Status ?? string.Empty);
        cmd.Parameters.AddWithValue("@senderID", capsule.SenderID);
        cmd.Parameters.AddWithValue("@recipientID", (object?)capsule.RecipientID ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@capsuleID", capsule.CapsuleID);

        return ExecuteCommand(conn, cmd);
    }

    public bool DeleteCapsule(int id)
{
    using var conn = new NpgsqlConnection(ConnectionString);
    conn.Open();

    using var transaction = conn.BeginTransaction(); // Begin a transaction
    try
    {
        // Delete related rows in the CapsuleTags table
        using (var deleteTagsCmd = conn.CreateCommand())
        {
            deleteTagsCmd.CommandText = "DELETE FROM \"capsuletags\" WHERE \"capsuleid\" = @id";
            deleteTagsCmd.Parameters.AddWithValue("@id", id);
            deleteTagsCmd.Transaction = transaction; // Use the transaction
            deleteTagsCmd.ExecuteNonQuery();
        }

        // Delete the capsule itself
        using (var deleteCapsuleCmd = conn.CreateCommand())
        {
            deleteCapsuleCmd.CommandText = "DELETE FROM \"Capsules\" WHERE \"CapsuleID\" = @id";
            deleteCapsuleCmd.Parameters.AddWithValue("@id", id);
            deleteCapsuleCmd.Transaction = transaction; // Use the transaction
            deleteCapsuleCmd.ExecuteNonQuery();
        }

        transaction.Commit(); // Commit the transaction
        return true; // Deletion successful
    }
    catch
    {
        transaction.Rollback(); // Rollback the transaction on failure
        throw; // Re-throw the exception
    }
}


    public List<Capsule> GetAllCapsules()
{
    var capsules = new List<Capsule>();
    using var conn = new NpgsqlConnection(ConnectionString);
    var cmd = conn.CreateCommand();
    cmd.CommandText = @"
        SELECT 
            c.""CapsuleID"",
            c.""Title"",
            c.""Message"",
            c.""LockDate"",
            c.""RecipientID"",
            c.""SenderId"",
            u.""Username"" AS ""SenderUsername""
        FROM 
            ""Capsules"" c
        LEFT JOIN
            ""Users"" u ON c.""SenderId"" = u.""UserID""";

    conn.Open();
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        var capsule = new Capsule
        {
            CapsuleID = reader.GetInt32(reader.GetOrdinal("CapsuleID")),
            Title = reader.GetString(reader.GetOrdinal("Title")),
            Message = reader.GetString(reader.GetOrdinal("Message")),
            LockDate = reader.GetDateTime(reader.GetOrdinal("LockDate")),
            RecipientID = reader.IsDBNull(reader.GetOrdinal("RecipientID")) 
                ? (int?)null 
                : reader.GetInt32(reader.GetOrdinal("RecipientID")),
            SenderID = reader.GetInt32(reader.GetOrdinal("SenderId")),
            SenderUsername = reader.GetString(reader.GetOrdinal("SenderUsername"))
        };
        capsules.Add(capsule);
    }

    return capsules;
}

}


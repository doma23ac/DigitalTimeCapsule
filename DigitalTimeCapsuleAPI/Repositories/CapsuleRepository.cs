using Npgsql;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

public class CapsuleRepository : BaseRepository
{
    public CapsuleRepository(IConfiguration configuration) : base(configuration) { }

    // Private Methode zur Wiederverwendung der SQL-Abfrage
    private List<Capsule> FetchCapsules(string whereClause = "", object? parameter = null)
    {
        var capsules = new List<Capsule>();
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();

        // SQL-Abfrage mit optionalem Filter
        cmd.CommandText = @"
            SELECT 
                c.""CapsuleID"",
                c.""Title"",
                c.""Message"",
                c.""LockDate"",
                c.""RecipientID"",
                c.""SenderId"",
                sender.""Username"" AS ""SenderUsername"",
                recipient.""Username"" AS ""RecipientUsername""
            FROM 
                ""Capsules"" c
            LEFT JOIN 
                ""Users"" sender ON c.""SenderId"" = sender.""UserID""
            LEFT JOIN 
                ""Users"" recipient ON c.""RecipientID"" = recipient.""UserID""
            " + whereClause;

        if (parameter != null)
        {
            cmd.Parameters.AddWithValue("@id", parameter);
        }

        conn.Open();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            capsules.Add(new Capsule
            {
                CapsuleID = reader.GetInt32(reader.GetOrdinal("CapsuleID")),
                Title = reader["Title"]?.ToString() ?? string.Empty,
                Message = reader["Message"]?.ToString() ?? string.Empty,
                LockDate = reader["LockDate"] is DBNull ? DateTime.MinValue : (DateTime)reader["LockDate"],
                SenderID = reader.GetInt32(reader.GetOrdinal("SenderId")),
                RecipientID = reader.IsDBNull(reader.GetOrdinal("RecipientID")) ? 0 : reader.GetInt32(reader.GetOrdinal("RecipientID")),
                SenderUsername = reader.IsDBNull(reader.GetOrdinal("SenderUsername")) ? string.Empty : reader.GetString(reader.GetOrdinal("SenderUsername")),
                RecipientUsername = reader.IsDBNull(reader.GetOrdinal("RecipientUsername")) ? string.Empty : reader.GetString(reader.GetOrdinal("RecipientUsername"))
            });
        }

        return capsules;
    }

    // Methode: Holen aller Kapseln
    public List<Capsule> GetAllCapsules()
    {
        return FetchCapsules();
    }

    // Methode: Holen einer Kapsel anhand der ID
    public Capsule? GetCapsuleById(int id)
    {
        var capsules = FetchCapsules("WHERE c.\"CapsuleID\" = @id", id);
        return capsules.FirstOrDefault();
    }

    // Methode: Kapsel einfügen
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
                ""SenderId"", 
                ""RecipientID""
            ) 
            VALUES (
                @title, 
                @message, 
                @lockDate, 
                @senderID, 
                @recipientID
            )
            RETURNING ""CapsuleID"";";

        cmd.Parameters.AddWithValue("@title", capsule.Title ?? string.Empty);
        cmd.Parameters.AddWithValue("@message", capsule.Message ?? string.Empty);
        cmd.Parameters.AddWithValue("@lockDate", capsule.LockDate);
        cmd.Parameters.AddWithValue("@senderID", capsule.SenderID);
       cmd.Parameters.AddWithValue("@recipientID", capsule.RecipientID);

        var result = cmd.ExecuteScalar();
        if (result == null || result == DBNull.Value)
        {
            throw new Exception("Failed to insert the capsule and retrieve CapsuleID.");
        }

        capsule.CapsuleID = Convert.ToInt32(result);
        return true;
    }

    // Methode: Kapsel löschen
    public bool DeleteCapsule(int id)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        conn.Open();

        using var transaction = conn.BeginTransaction();
        try
        {
            // Löschen der zugehörigen Tags
            using (var deleteTagsCmd = conn.CreateCommand())
            {
                deleteTagsCmd.CommandText = "DELETE FROM \"capsuletags\" WHERE \"capsuleid\" = @id";
                deleteTagsCmd.Parameters.AddWithValue("@id", id);
                deleteTagsCmd.Transaction = transaction;
                deleteTagsCmd.ExecuteNonQuery();
            }

            // Löschen der Kapsel selbst
            using (var deleteCapsuleCmd = conn.CreateCommand())
            {
                deleteCapsuleCmd.CommandText = "DELETE FROM \"Capsules\" WHERE \"CapsuleID\" = @id";
                deleteCapsuleCmd.Parameters.AddWithValue("@id", id);
                deleteCapsuleCmd.Transaction = transaction;
                deleteCapsuleCmd.ExecuteNonQuery();
            }

            transaction.Commit();
            return true;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }
}


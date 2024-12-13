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
    cmd.CommandText = "SELECT * FROM Capsules WHERE CapsuleID = @id";
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
    var cmd = conn.CreateCommand();
    cmd.CommandText = @"
        INSERT INTO Capsules (Title, Message, LockDate, Status, SenderID, RecipientID) 
        VALUES (@title, @message, @lockDate, @status, @senderID, @recipientID)";
    cmd.Parameters.AddWithValue("@title", capsule.Title ?? string.Empty);
    cmd.Parameters.AddWithValue("@message", capsule.Message ?? string.Empty);
    cmd.Parameters.AddWithValue("@lockDate", capsule.LockDate);
    cmd.Parameters.AddWithValue("@status", capsule.Status ?? string.Empty);
    cmd.Parameters.AddWithValue("@senderID", capsule.SenderID);
    cmd.Parameters.AddWithValue("@recipientID", (object?)capsule.RecipientID ?? DBNull.Value);

    return ExecuteCommand(conn, cmd);
}


    public bool UpdateCapsule(Capsule capsule)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            UPDATE Capsules SET 
                Title = @title,
                Message = @message,
                LockDate = @lockDate,
                Status = @status,
                SenderID = @senderID,
                RecipientID = @recipientID
            WHERE CapsuleID = @capsuleID";
        cmd.Parameters.AddWithValue("@title", capsule.Title);
        cmd.Parameters.AddWithValue("@message", capsule.Message);
        cmd.Parameters.AddWithValue("@lockDate", capsule.LockDate);
        cmd.Parameters.AddWithValue("@status", capsule.Status);
        cmd.Parameters.AddWithValue("@senderID", capsule.SenderID);
        cmd.Parameters.AddWithValue("@recipientID", (object)capsule.RecipientID ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@capsuleID", capsule.CapsuleID);

        return ExecuteCommand(conn, cmd);
    }

    public bool DeleteCapsule(int id)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM Capsules WHERE CapsuleID = @id";
        cmd.Parameters.AddWithValue("@id", id);

        return ExecuteCommand(conn, cmd);
    }

    public List<Capsule> GetAllCapsules()
    {
        var capsules = new List<Capsule>();
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Capsules";

        var reader = GetData(conn, cmd);
        while (reader.Read())
        {
            capsules.Add(new Capsule
            {
                CapsuleID = (int)reader["CapsuleID"],
                Title = reader["Title"].ToString(),
                Message = reader["Message"].ToString(),
                LockDate = (DateTime)reader["LockDate"],
                Status = reader["Status"].ToString(),
                SenderID = (int)reader["SenderID"],
                RecipientID = reader["RecipientID"] as int?
            });
        }
        return capsules;
    }
}

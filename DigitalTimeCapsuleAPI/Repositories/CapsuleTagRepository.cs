using Npgsql;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

public class CapsuleTagRepository : BaseRepository
{
    public CapsuleTagRepository(IConfiguration configuration) : base(configuration) { }

    // Add a tag to a capsule
    public bool AddTagToCapsule(int capsuleId, int tagId)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        conn.Open();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO CapsuleTags (CapsuleID, TagID)
            VALUES (@capsuleId, @tagId)
            ON CONFLICT DO NOTHING;"; // Prevents duplicate entries
        cmd.Parameters.AddWithValue("@capsuleId", capsuleId);
        cmd.Parameters.AddWithValue("@tagId", tagId);

        return ExecuteCommand(conn, cmd);
    }

    // Remove a tag from a capsule
    public bool RemoveTagFromCapsule(int capsuleId, int tagId)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        conn.Open();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            DELETE FROM CapsuleTags
            WHERE CapsuleID = @capsuleId AND TagID = @tagId;";
        cmd.Parameters.AddWithValue("@capsuleId", capsuleId);
        cmd.Parameters.AddWithValue("@tagId", tagId);

        return ExecuteCommand(conn, cmd);
    }

    // Get all tags associated with a capsule
    public List<Tag> GetTagsByCapsuleId(int capsuleId)
    {
        var tags = new List<Tag>();
        using var conn = new NpgsqlConnection(ConnectionString);
        conn.Open();
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT t.TagID, t.TagName
            FROM CapsuleTags ct
            INNER JOIN Tags t ON ct.TagID = t.TagID
            WHERE ct.CapsuleID = @capsuleId;";
        cmd.Parameters.AddWithValue("@capsuleId", capsuleId);

        var reader = GetData(conn, cmd);
        while (reader.Read())
        {
            tags.Add(new Tag
            {
                TagID = (int)reader["TagID"],
                TagName = reader["TagName"].ToString()
            });
        }
        return tags;
    }
}

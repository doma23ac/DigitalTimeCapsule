using Npgsql;

public class TagRepository : BaseRepository
{
    public TagRepository(IConfiguration configuration) : base(configuration) { }

    public Tag GetTagById(int id)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Tags WHERE TagID = @id";
        cmd.Parameters.AddWithValue("@id", id);

        var reader = GetData(conn, cmd);
        if (reader.Read())
        {
            return new Tag
            {
                TagID = (int)reader["TagID"],
                TagName = reader["TagName"].ToString()
            };
        }
        return null;
    }

    public List<Tag> GetAllTags()
    {
        var tags = new List<Tag>();
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM Tags";

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

    public List<Tag> GetTagsByCapsuleId(int capsuleId)
    {
        var tags = new List<Tag>();
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT t.TagID, t.TagName
            FROM CapsuleTags ct
            INNER JOIN Tags t ON ct.TagID = t.TagID
            WHERE ct.CapsuleID = @capsuleId";
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

    public bool InsertTag(Tag tag)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "INSERT INTO Tags (TagName) VALUES (@tagName)";
        cmd.Parameters.AddWithValue("@tagName", tag.TagName);

        return ExecuteCommand(conn, cmd);
    }

    public bool UpdateTag(Tag tag)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "UPDATE Tags SET TagName = @tagName WHERE TagID = @tagID";
        cmd.Parameters.AddWithValue("@tagName", tag.TagName);
        cmd.Parameters.AddWithValue("@tagID", tag.TagID);

        return ExecuteCommand(conn, cmd);
    }

    public bool DeleteTag(int id)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM Tags WHERE TagID = @id";
        cmd.Parameters.AddWithValue("@id", id);

        return ExecuteCommand(conn, cmd);
    }

    public bool AddTagToCapsule(int capsuleId, int tagId)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "INSERT INTO CapsuleTags (CapsuleID, TagID) VALUES (@capsuleId, @tagId)";
        cmd.Parameters.AddWithValue("@capsuleId", capsuleId);
        cmd.Parameters.AddWithValue("@tagId", tagId);

        return ExecuteCommand(conn, cmd);
    }

    public bool RemoveTagFromCapsule(int capsuleId, int tagId)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        var cmd = conn.CreateCommand();
        cmd.CommandText = "DELETE FROM CapsuleTags WHERE CapsuleID = @capsuleId AND TagID = @tagId";
        cmd.Parameters.AddWithValue("@capsuleId", capsuleId);
        cmd.Parameters.AddWithValue("@tagId", tagId);

        return ExecuteCommand(conn, cmd);
    }
}


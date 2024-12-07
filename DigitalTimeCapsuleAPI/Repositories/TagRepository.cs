using Npgsql;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;

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
}

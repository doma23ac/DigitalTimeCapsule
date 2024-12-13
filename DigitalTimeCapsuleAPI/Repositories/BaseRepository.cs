using Npgsql;
using Microsoft.Extensions.Configuration;
using System.Data;

public class BaseRepository
{
    protected string ConnectionString { get; }

    public BaseRepository(IConfiguration configuration)
    {
        ConnectionString = configuration.GetConnectionString("DefaultConnection");
    }

    protected NpgsqlDataReader GetData(NpgsqlConnection conn, NpgsqlCommand cmd)
    {
        try
        {
            if (conn.State != ConnectionState.Open) // Ensure the connection is only opened if needed
            {
                conn.Open();
            }
            return cmd.ExecuteReader(CommandBehavior.CloseConnection); // Automatically closes connection when reader is disposed
        }
        catch (Exception ex)
        {
            throw new Exception($"Error executing data reader: {ex.Message}", ex);
        }
    }

    protected bool ExecuteCommand(NpgsqlConnection conn, NpgsqlCommand cmd)
    {
        try
        {
            if (conn.State != ConnectionState.Open) // Ensure the connection is only opened if needed
            {
                conn.Open();
            }
            cmd.ExecuteNonQuery();
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error executing command: {ex.Message}", ex);
        }
        finally
        {
            if (conn.State == ConnectionState.Open)
            {
                conn.Close(); // Ensure the connection is closed
            }
        }
    }
}

using System.Text;

public class BasicAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<BasicAuthenticationMiddleware> _logger;

    public BasicAuthenticationMiddleware(RequestDelegate next, ILogger<BasicAuthenticationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip authentication for specific paths (e.g., Login API)
        if (context.Request.Path.StartsWithSegments("/api/login") || context.Request.Path.StartsWithSegments("/swagger"))
        {
            await _next(context);
            return;
        }

        string? authHeader = context.Request.Headers["Authorization"];
        if (authHeader == null || !authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }

        var encodedCredentials = authHeader.Substring("Basic ".Length).Trim();
        var decodedCredentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));
        var credentials = decodedCredentials.Split(':');

        if (credentials.Length == 2) // Placeholder for additional validation
        {
            await _next(context);
        }
        else
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid credentials");
        }
    }
}




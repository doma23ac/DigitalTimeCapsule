using System.Text;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace DigitalTimeCapsuleAPI.Middleware
{
    public class BasicAuthenticationMiddleware
    {
        private const string Email = "john.doe";  // Expected username
        private const string Password = "VerySecret!";  // Expected password

        private readonly RequestDelegate _next;
        private readonly ILogger<BasicAuthenticationMiddleware> _logger;

        public BasicAuthenticationMiddleware(RequestDelegate next, ILogger<BasicAuthenticationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Skip authentication for Swagger UI
            if (context.Request.Path.StartsWithSegments("/swagger"))
            {
                await _next(context);  // Skip authentication and continue processing the request
                return;
            }

            // Proceed with authentication if it's not Swagger UI
            _logger.LogInformation("Checking Authorization Header...");

            // Retrieve the Authorization header
            string? authHeader = context.Request.Headers["Authorization"];
            _logger.LogInformation("Authorization header received: {AuthHeader}", authHeader);

            if (authHeader == null)
            {
                _logger.LogWarning("Authorization Header not provided");
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Authorization Header not provided");
                return;
            }

            // Check if the Authorization header is in Basic format
            if (!authHeader.StartsWith("Basic ", System.StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Authorization header is not in Basic format");
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Authorization header is not in Basic format");
                return;
            }

            // Decode the credentials from Base64
            var encodedCredentials = authHeader.Substring("Basic ".Length).Trim();
            var decodedCredentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));

            _logger.LogInformation("Decoded Credentials: {DecodedCredentials}", decodedCredentials);

            var usernameAndPassword = decodedCredentials.Split(':');
            if (usernameAndPassword.Length != 2)
            {
                _logger.LogWarning("Invalid Basic Authentication format");
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Invalid Basic Authentication format");
                return;
            }

            var username = usernameAndPassword[0];
            var password = usernameAndPassword[1];

            _logger.LogInformation("Username: {Username}, Password: {Password}", username, password);

            // Check credentials (replace with DB query in real scenario)
            if (username == Email && password == Password)
            {
                await _next(context);  // Proceed to the next middleware if valid
            }
            else
            {
                _logger.LogWarning("Invalid credentials for user: {Username}", username);
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Invalid credentials");
            }
        }
    }
}


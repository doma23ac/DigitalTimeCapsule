using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Entity Framework Core with PostgreSQL
builder.Services.AddDbContext<DigitalTimeCapsuleContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories for Dependency Injection
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<CapsuleRepository>();
builder.Services.AddScoped<TagRepository>();
builder.Services.AddScoped<CapsuleTagRepository>(); // Add this line


// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy to allow cross-origin requests
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()   // Allow any origin
              .AllowAnyMethod()   // Allow any HTTP method (GET, POST, etc.)
              .AllowAnyHeader()); // Allow any headers
});

var app = builder.Build();

// Enable CORS before other middleware
app.UseCors("AllowAll"); // This enables CORS globally

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Enable Authorization middleware
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();

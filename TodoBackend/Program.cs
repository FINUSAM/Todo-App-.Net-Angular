using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using TodoBackend.Data;
using TodoBackend.Helpers;
using TodoBackend.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Read allowed origins from configuration
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

// Register DbContext with MySQL provider
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TodoContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowConfiguredOrigins", policy =>
    {
        policy.WithOrigins(allowedOrigins ?? Array.Empty<string>())
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed/initialize the database
app.Services.InitializeDatabase();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files for uploaded photos
var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedPhotos");
//var uploadsFolder = builder.Configuration.GetValue<string>("UploadsFolder") ?? "/app/UploadedPhotos";

if (!Directory.Exists(uploadsFolder))
{
    Directory.CreateDirectory(uploadsFolder);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsFolder),
    RequestPath = "/uploads"
});

// Enable CORS
app.UseCors("AllowConfiguredOrigins");

// Map your endpoints
app.MapTodoEndpoints();

app.Run();

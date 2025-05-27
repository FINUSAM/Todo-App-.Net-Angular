using Microsoft.EntityFrameworkCore;
using TodoBackend.Data;
using TodoBackend.Models;

namespace TodoBackend.Endpoints
{
    public static class TodoEndpoints
    {
        public static void MapTodoEndpoints(this WebApplication app)
        {
            // Get all todos
            app.MapGet("/todos", async (TodoContext db) =>
                await db.TodoItems.ToListAsync())
                .WithName("GetTodos")
                .WithOpenApi();

            // Get todo by Id
            app.MapGet("/todos/{id}", async (int id, TodoContext db) =>
                await db.TodoItems.FindAsync(id)
                    is TodoItem todo
                        ? Results.Ok(todo)
                        : Results.NotFound())
                .WithName("GetTodoById")
                .WithOpenApi();

            // Create a new todo
            app.MapPost("/todos", async (TodoItem todo, TodoContext db) =>
            {
                db.TodoItems.Add(todo);
                await db.SaveChangesAsync();
                return Results.Created($"/todos/{todo.Id}", todo);
            })
            .WithName("CreateTodo")
            .WithOpenApi();

            // Update a todo
            app.MapPut("/todos/{id}", async (int id, TodoItem inputTodo, TodoContext db) =>
            {
                var todo = await db.TodoItems.FindAsync(id);
                if (todo == null) return Results.NotFound();

                todo.Title = inputTodo.Title;
                todo.IsCompleted = inputTodo.IsCompleted;

                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("UpdateTodo")
            .WithOpenApi();

            // Delete a todo
            app.MapDelete("/todos/{id}", async (int id, TodoContext db) =>
            {
                var todo = await db.TodoItems.FindAsync(id);
                if (todo == null) return Results.NotFound();

                db.TodoItems.Remove(todo);
                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("DeleteTodo")
            .WithOpenApi();

            // photo uploadings
            // Upload a photo
            app.MapPost("/upload/photo", async (HttpRequest request) =>
            {
                var file = request.Form.Files.FirstOrDefault();
                if (file == null || file.Length == 0)
                {
                    return Results.BadRequest("No file uploaded.");
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedPhotos");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Results.Ok(new { fileName = file.FileName, filePath });
            })
            .WithName("UploadPhoto")
            .WithOpenApi();

            // List all uploaded photos
            app.MapGet("/upload/photos", (HttpContext context) =>
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedPhotos");
                if (!Directory.Exists(uploadsFolder))
                {
                    return Results.Ok(new List<string>());
                }

                var requestUrl = $"{context.Request.Scheme}://{context.Request.Host}";
                var files = Directory.GetFiles(uploadsFolder)
                    .Select(filePath => $"{requestUrl}/uploads/{Path.GetFileName(filePath)}")
                    .ToList();

                return Results.Ok(files);
            })
            .WithName("GetAllPhotos")
            .WithOpenApi();


        }
    }
}

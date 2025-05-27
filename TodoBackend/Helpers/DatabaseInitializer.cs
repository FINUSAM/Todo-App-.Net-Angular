using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TodoBackend.Data;

namespace TodoBackend.Helpers
{
    public static class DatabaseInitializer
    {
        public static void InitializeDatabase(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<TodoContext>();
            db.Database.EnsureCreated();
        }
    }
}

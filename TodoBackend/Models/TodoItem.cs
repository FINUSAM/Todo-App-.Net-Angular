// Models/TodoItem.cs
using System.ComponentModel.DataAnnotations;

namespace TodoBackend.Models
{
    public class TodoItem
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = null!;

        public bool IsCompleted { get; set; }
    }
}

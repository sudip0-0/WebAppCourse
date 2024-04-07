using Microsoft.EntityFrameworkCore;

namespace course_app_backend.Models
{
    public class CourseContext : DbContext
    {
        public CourseContext(DbContextOptions<CourseContext> options) :base(options)
        {
            
        }
        public DbSet<Course> Courses { get; set; }
    }
}

using course_app_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace course_app_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly CourseContext _courseContext;
        public CourseController(CourseContext courseContext)
        {
            _courseContext = courseContext;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            if(_courseContext.Courses ==null)
            {
                return NotFound();
            }
            return await _courseContext.Courses.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            if (_courseContext.Courses == null)
            {
                return NotFound();
            }
            var course = await _courseContext.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }
            return course;
        }

        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse(Course course)
        {
            _courseContext.Courses.Add(course);
            await _courseContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCourse), new {id=course.ID},course);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutCourse(int id,Course course)
        {
            if(id != course.ID)
            {
                return BadRequest();
            }
            _courseContext.Entry(course).State = EntityState.Modified;
            try
            {
                await _courseContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex) { throw; }
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            if(_courseContext.Courses == null)
            { return NotFound(); }
            var employee = await _courseContext.Courses.FindAsync(id);
            if (employee == null) { return NotFound();}
            _courseContext.Courses.Remove(employee);
            await _courseContext.SaveChangesAsync();
            return Ok();
        }
    }
}

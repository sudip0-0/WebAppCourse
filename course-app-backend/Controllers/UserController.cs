using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using course_app_backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace course_app_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserContext _context; 

        public UserController(UserContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest("Email is already registered");
            }
            var secretkey = "64a6988ec0ecacbdf40ecf504e70b9a5f6174a8992c856c7ee22e1e0be03a8890412904b9d17a467d03559fe573c324271615dbcf191e4cfc259b5a01a3bb824";
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(secretkey)); 
            user.Password = Encoding.UTF8.GetString(hmac.ComputeHash(Encoding.UTF8.GetBytes(user.Password)));

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(User user)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser == null)
            {
                return Unauthorized("Invalid email or password");
            }
            var secretkey = "64a6988ec0ecacbdf40ecf504e70b9a5f6174a8992c856c7ee22e1e0be03a8890412904b9d17a467d03559fe573c324271615dbcf191e4cfc259b5a01a3bb824";

            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(secretkey));
            var computedHash = Encoding.UTF8.GetString(hmac.ComputeHash(Encoding.UTF8.GetBytes(user.Password)));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != existingUser.Password[i])
                {
                    return Unauthorized("Invalid email or password");
                }
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, existingUser.Id.ToString()),
                new Claim(ClaimTypes.Name, existingUser.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretkey)); 
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}

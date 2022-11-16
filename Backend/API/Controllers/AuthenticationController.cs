using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticateController : ControllerBase
{
    //public readonly IIdentityService _identityService;
    //private readonly IConfiguration _configuration;

    //public AuthenticateController(IIdentityService identityService, IConfiguration configuration)
    //{
    //    _identityService = identityService;
    //    _configuration = configuration;
    //}

    [HttpGet]
    public IActionResult Test()
    {
        return Ok("Ok");
    }

    //[HttpPost]
    //[Route("login")]
    //public async Task<IActionResult> Login([FromBody] LoginModel model)
    //{
    //    if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
    //    {
    //        return Unauthorized();
    //    }
    //    var user = await _identityService.FindByNameAsync(model.Username);
    //    if (user != null && await _identityService.CheckPasswordAsync(user, model.Password))
    //    {
    //        var userRoles = await _identityService.GetRolesAsync(user);

    //        var authClaims = new List<Claim>
    //            {
    //                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    //                new Claim(ClaimTypes.Name, user.UserName),
    //                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    //            };

    //        foreach (var userRole in userRoles)
    //        {
    //            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
    //        }

    //        var token = GenerateToken(authClaims);

    //        return Ok(new
    //        {
    //            token = new JwtSecurityTokenHandler().WriteToken(token),
    //            expiration = token.ValidTo
    //        });
    //    }

    //    return Unauthorized();
    //}

    //[HttpPost]
    //[Route("register")]
    //public async Task<IActionResult> Register([FromBody] RegisterModel model)
    //{
    //    var userExists = await _identityService.FindByNameAsync(model.Username);
    //    if (userExists != null)
    //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

    //    ApplicationUser user = new()
    //    {
    //        Email = model.Email,
    //        SecurityStamp = Guid.NewGuid().ToString(),
    //        UserName = model.Username
    //    };
    //    var result = await _identityService.CreateUserAsync(user, model.Password);
    //    if (!result.Result.Succeeded)
    //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

    //    return Ok(new Response { Status = "Success", Message = "User created successfully!" });
    //}

    //[HttpPost]
    //[Route("register-admin")]
    //public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
    //{
    //    var userExists = await _identityService.FindByNameAsync(model.Username);
    //    if (userExists != null)
    //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

    //    ApplicationUser user = new()
    //    {
    //        Email = model.Email,
    //        SecurityStamp = Guid.NewGuid().ToString(),
    //        UserName = model.Username
    //    };
    //    var result = await _identityService.CreateUserAsync(user, model.Password);
    //    if (!result.Result.Succeeded)
    //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

    //    if (!await _identityService.RoleExistsAsync(UserRoles.Admin))
    //        await _identityService.CreateRoleAsync(UserRoles.Admin);
    //    if (!await _identityService.RoleExistsAsync(UserRoles.User))
    //        await _identityService.CreateRoleAsync(UserRoles.User);

    //    if (await _identityService.RoleExistsAsync(UserRoles.Admin))
    //    {
    //        await _identityService.AddToRoleAsync(user, UserRoles.Admin);
    //    }
    //    if (await _identityService.RoleExistsAsync(UserRoles.Admin))
    //    {
    //        await _identityService.AddToRoleAsync(user, UserRoles.User);
    //    }
    //    return Ok(new Response { Status = "Success", Message = "User created successfully!" });
    //}

    //private JwtSecurityToken GenerateToken(List<Claim> authClaims)
    //{
    //    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

    //    var token = new JwtSecurityToken(
    //        issuer: _configuration["JWT:ValidIssuer"],
    //        audience: _configuration["JWT:ValidAudience"],
    //        expires: DateTime.Now.AddHours(3),
    //        claims: authClaims,
    //        signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
    //        );

    //    return token;
    //}
}

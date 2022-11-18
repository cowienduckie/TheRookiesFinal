using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticateController : ControllerBase
{
    [HttpGet]
    public IActionResult Test()
    {
        return Ok("Ok");
    }
}

using Application.Common.Models;
using Application.DTOs.Users;
using Application.Services.Interfaces;
using BookLibrary.WebApi.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticationController : BaseController
{
    private readonly IUserService _userService;

    public AuthenticationController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<Response<AuthenticationResponse>>> Login(
        [FromBody] AuthenticationRequest requestModel)
    {
        try
        {
            var response = await _userService.AuthenticateAsync(requestModel);

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}

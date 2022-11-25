using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Users.GetUser;
using Application.Services.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[Authorize(UserRoles.Admin)]
[ApiController]
public class UsersController : BaseController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<GetUserResponse>>> GetById(Guid id)
    {
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        var getUserRequest = new GetUserRequest
        {
            Id = id,
            Location = CurrentUser.Location
        };

        try
        {
            var response = await _userService.GetAsync(getUserRequest);

            if (!response.IsSuccess)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}

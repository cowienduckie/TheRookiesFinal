using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Users.ChangePassword;
using Application.Services.Interfaces;
using Domain.Shared.Constants;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class AccountsController : BaseController
{
    private readonly IUserService _userService;

    public AccountsController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPut("change-password")]
    public async Task<ActionResult<Response>> ChangePassword([FromBody] ChangePasswordRequest requestModel)
    {
        try
        {
            if (CurrentUser == null)
            {
                return BadRequest(new Response(false, ErrorMessages.BadRequest));
            }

            requestModel.Id = CurrentUser?.Id;

            var response = await _userService.ChangePasswordAsync(requestModel);

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
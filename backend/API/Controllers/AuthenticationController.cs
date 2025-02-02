﻿using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Users.Authentication;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/authentication")]
[ApiController]
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

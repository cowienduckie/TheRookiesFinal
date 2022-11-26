using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Users.CreateUser;
using Application.Services.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
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

        [HttpPost("create")]
        public async Task<ActionResult<Response<CreateUserResponse>>> CreateUser([FromBody] CreateUserRequest requestModel)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new Response(false, ErrorMessages.BadRequest));
                }

                requestModel.AdminId = CurrentUser.Id;

                var response = await _userService.CreateUserAsync(requestModel);

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
}

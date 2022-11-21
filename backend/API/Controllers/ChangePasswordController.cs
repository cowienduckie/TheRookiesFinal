using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Users.Authentication;
using Application.DTOs.Users.ChangePassword;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/changepassword")]
    [ApiController]
    public class ChangePasswordController : BaseController
    {
        private readonly IUserService _userService;

        public ChangePasswordController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Response<bool>>> ChangePassword([FromBody] ChangePasswordRequest requestModel)
        {
            try
            {
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
}

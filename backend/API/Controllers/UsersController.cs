using API.Attributes;
using Application.Services.Interfaces;
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
    }
}

using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Users.GetUser;
using Application.DTOs.Users.GetListUsers;
using Application.Services.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Microsoft.AspNetCore.Mvc;
using Application.Queries;
using Application.DTOs.Users.EditUser;

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

    [HttpGet]
    public async Task<ActionResult<Response<GetListUsersResponse>>> GetList(
        [FromQuery] PagingQuery pagingQuery,
        [FromQuery] SortQuery sortQuery,
        [FromQuery] FilterQuery filterQuery,
        [FromQuery] SearchQuery searchQuery)
    {
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        if (sortQuery.SortField == ModelFields.None)
        {
            sortQuery.SortField = ModelFields.FullName;
        }

        var request = new GetListUsersRequest(CurrentUser.Location,
                                                pagingQuery,
                                                sortQuery,
                                                filterQuery,
                                                searchQuery);

        try
        {
            var response = await _userService.GetListAsync(request);

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

    [HttpPut("edit")]
        public async Task<ActionResult<Response<EditUserResponse>>> Update(
        [FromBody] EditUserRequest requestModel) 
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new Response(false, ErrorMessages.BadRequest));
                }

                requestModel.AdminLocation = CurrentUser.Location;

                var response = await _userService.EditUserAsync(requestModel);

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

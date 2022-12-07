using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Assignments.GetAssignment;
using Application.DTOs.Assignments.GetListAssignments;
using Application.DTOs.Assignments.RespondAssignment;
using Application.DTOs.Users.ChangePassword;
using Application.Queries;
using Application.Queries.Assignments;
using Application.Services.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssignmentsController : BaseController
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentsController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [Authorize(UserRole.Admin)]
    [HttpGet("{id}")]
    public async Task<ActionResult<Response<GetAssignmentResponse>>> GetById(Guid id)
    {
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        var request = new GetAssignmentRequest
        {
            Id = id,
            Location = CurrentUser.Location
        };

        try
        {
            var response = await _assignmentService.GetAsync(request);

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

    [Authorize(UserRole.Admin)]
    [HttpGet]
    public async Task<ActionResult<Response>> GetList(
        [FromQuery] PagingQuery pagingQuery,
        [FromQuery] SortQuery sortQuery,
        [FromQuery] AssignmentFilter assignmentFilter,
        [FromQuery] SearchQuery searchQuery)
    {
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        if (sortQuery.SortField == ModelField.None)
        {
            sortQuery.SortField = ModelField.AssetName;
        }

        var request = new GetListAssignmentsRequest(pagingQuery, sortQuery, searchQuery, assignmentFilter, CurrentUser.Location);

        try
        {
            var response = await _assignmentService.GetListAsync(request);

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

    [Authorize]
    [HttpGet("owned-assignments/{id}")]
    public async Task<ActionResult<Response<GetAssignmentResponse>>> GetOwnedAssignment(Guid id)
    {
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        var request = new GetAssignmentRequest
        {
            Id = id,
            Location = CurrentUser.Location
        };

        try
        {
            var response = await _assignmentService.GetAsync(request);

            if (response.IsSuccess && response.Data!.AssignedTo != CurrentUser.Username)
            {
                return BadRequest(new Response(false, ErrorMessages.BadRequest));
            }

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

    [Authorize]
    [HttpGet("owned-assignments")]
    public async Task<ActionResult<Response<GetAssignmentResponse>>> GetOwnedAssignmentsList(
        [FromQuery] PagingQuery pagingQuery,
        [FromQuery] SortQuery sortQuery
    )
    {
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        if (sortQuery.SortField == ModelField.None)
        {
            sortQuery.SortField = ModelField.AssetName;
        }

        var request = new GetListOwnedAssignmentsRequest(pagingQuery, sortQuery, CurrentUser);

        try
        {
            var response = await _assignmentService.GetOwnedListAsync(request);

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

    [Authorize(UserRole.Admin, UserRole.Staff)]
    [HttpPut("response")]
    public async Task<ActionResult<Response>> RespondAssignmentAsync([FromBody] RespondAssignmentRequest request)
    {
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        try
        {
            var response = await _assignmentService.RespondAssignmentAsync(request);

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
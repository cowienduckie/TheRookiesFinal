using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Assignments.CreateAssignment;
using Application.DTOs.Assignments.GetAssignment;
using Application.DTOs.RequestsForReturning.CreateRequestForReturning;
using Application.DTOs.RequestsForReturning.GetRequestForReturning;
using Application.Services;
using Application.Services.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RequestsForReturningController : BaseController
{
    private readonly IRequestForReturningService _requestForReturningService;

    public RequestsForReturningController(IRequestForReturningService requestForReturningService)
    {
        _requestForReturningService = requestForReturningService;
    }

    [Authorize(UserRole.Admin)]
    [HttpPost]
    public async Task<ActionResult<Response<GetRequestForReturningResponse>>> Create([FromBody] CreateRequestForReturningRequest request)
    {
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        request.RequestedBy = CurrentUser.Id;

        try
        {
            var response = await _requestForReturningService.CreateAsync(request);

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
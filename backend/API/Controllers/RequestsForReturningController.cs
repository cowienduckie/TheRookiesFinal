using API.Attributes;
using Application.Common.Models;
using Application.DTOs.RequestsForReturning.GetListRequestsForReturning;
using Application.Queries;
using Application.Queries.RequestsForReturning;
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
    [HttpGet]
    public async Task<ActionResult<Response<GetListRequestsForReturningResponse>>> GetList(
        [FromQuery] PagingQuery pagingQuery,
        [FromQuery] SortQuery sortQuery,
        [FromQuery] RequestForReturningFilter filter,
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

        var request = new GetListRequestsForReturningRequest(
            pagingQuery,
            sortQuery,
            searchQuery,
            filter,
            CurrentUser.Location);

        try
        {
            var response = await _requestForReturningService.GetListAsync(request);

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
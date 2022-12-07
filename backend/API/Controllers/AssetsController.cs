using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Assets.GetAsset;
using Application.DTOs.Assets.GetListAssets;
using Application.Queries;
using Application.Queries.Assets;
using Application.DTOs.Assets.CreateAsset;
using Application.DTOs.Users.CreateUser;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Domain.Shared.Enums;
using Domain.Shared.Constants;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssetsController : BaseController
{
    private readonly IAssetService _assetService;

    public AssetsController(IAssetService assetService)
    {
        _assetService = assetService;
    }

    [Authorize(UserRole.Admin, UserRole.Staff)]
    [HttpGet("{id}")]
    public async Task<ActionResult<Response<GetAssetResponse>>> GetById(Guid id)
    {
        if (CurrentUser == null) return BadRequest(new Response(false, ErrorMessages.BadRequest));

        var request = new GetAssetRequest
        {
            Id = id,
            Location = CurrentUser.Location
        };

        try
        {
            var response = await _assetService.GetAsync(request);

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
        [FromQuery] AssetFilter assetFilter,
        [FromQuery] SearchQuery searchQuery)
    {
        if (CurrentUser == null) return BadRequest(new Response(false, ErrorMessages.BadRequest));

        if (sortQuery.SortField == ModelField.None)
        {
        }

        var request = new GetListAssetsRequest(pagingQuery, sortQuery, searchQuery, assetFilter, CurrentUser.Location);

        try
        {
            var response = await _assetService.GetListAsync(request);

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
    [HttpPost]
    public async Task<ActionResult<Response<GetAssetResponse>>> CreateAsset([FromBody] CreateAssetRequest requestModel)
    {
        try
        {
            if (CurrentUser == null)
            {
                return BadRequest(new Response<CreateUserResponse>(false, ErrorMessages.BadRequest));
            }

            requestModel.Location = CurrentUser.Location;

            var response = await _assetService.CreateAssetAsync(requestModel);

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

    [Authorize(UserRole.Admin)]
    [HttpPut("delete")]
    public async Task<ActionResult<Response>> DeleteById([FromBody] Guid id)
    {
        if (CurrentUser == null) return BadRequest(new Response(false, ErrorMessages.BadRequest));

        try
        {
            var response = await _assetService.DeleteAssetAsync(id);

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
using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Assets.GetAsset;
using Application.Services.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Microsoft.AspNetCore.Mvc;

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
        if (CurrentUser == null)
        {
            return BadRequest(new Response(false, ErrorMessages.BadRequest));
        }

        var request = new GetAssetRequest
        {
            Id = id,
            Location = CurrentUser.Location
        };

        try
        {
            var response = await _assetService.GetByIdAsync(request);

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
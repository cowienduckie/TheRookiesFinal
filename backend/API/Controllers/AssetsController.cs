using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Assets.CreateAsset;
using Application.DTOs.Categories;
using Application.DTOs.Users.CreateUser;
using Application.Services;
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

    [Authorize(UserRole.Admin)]
    [HttpPost]
    public async Task<ActionResult<Response<CreateAssetResponse>>> CreateAsset([FromBody] CreateAssetRequest requestModel)
    {
        try
        {
            if (CurrentUser == null)
            {
                return BadRequest(new Response<CreateUserResponse>(false, ErrorMessages.BadRequest));
            }

            requestModel.Location = CurrentUser.Location;
            requestModel.CreatedBy = CurrentUser.Id;

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
}
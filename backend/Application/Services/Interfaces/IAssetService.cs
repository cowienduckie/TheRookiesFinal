using Application.Common.Models;
using Application.DTOs.Assets.GetAsset;

namespace Application.Services.Interfaces;

public interface IAssetService
{
    Task<Response<GetAssetResponse>> GetByIdAsync(GetAssetRequest request);
}
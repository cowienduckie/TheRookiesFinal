using Application.Common.Models;
using Application.DTOs.Assets.CreateAsset;
using Application.DTOs.Assets.GetAsset;
using Application.DTOs.Assets.GetListAssets;

namespace Application.Services.Interfaces;

public interface IAssetService
{
    Task<Response<GetAssetResponse>> CreateAssetAsync(CreateAssetRequest requestModel);
    Task<Response<GetAssetResponse>> GetAsync(GetAssetRequest request);
    Task<Response<GetListAssetsResponse>> GetListAsync(GetListAssetsRequest request);
    Task<Response> DeleteAssetAsync(Guid Id);
}
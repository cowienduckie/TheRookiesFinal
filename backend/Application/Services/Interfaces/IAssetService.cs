using Application.Common.Models;
using Application.DTOs.Assets.CreateAsset;
using Application.DTOs.Users.CreateUser;
using Application.DTOs.Assets.GetAsset;
using Application.DTOs.Assets.GetListAssets;

namespace Application.Services.Interfaces;

public interface IAssetService
{
    Task<Response<CreateAssetResponse>> CreateAssetAsync(CreateAssetRequest requestModel);
    Task<Response<GetAssetResponse>> GetAsync(GetAssetRequest request);
    Task<Response<GetListAssetsResponse>> GetListAsync(GetListAssetsRequest request);
}
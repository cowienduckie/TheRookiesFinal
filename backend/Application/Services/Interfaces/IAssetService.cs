using Application.Common.Models;
using Application.DTOs.Assets.CreateAsset;
using Application.DTOs.Users.CreateUser;

namespace Application.Services.Interfaces;

public interface IAssetService
{
    Task<Response<CreateAssetResponse>> CreateAssetAsync(CreateAssetRequest requestModel);
}
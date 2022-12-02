using Application.Common.Models;
using Application.DTOs.Assets.GetAsset;
using Application.Services.Interfaces;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class AssetService : BaseService, IAssetService
{
    public AssetService(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    public Task<Response<GetAssetResponse>> GetByIdAsync(GetAssetRequest request)
    {
        throw new NotImplementedException();
    }
}
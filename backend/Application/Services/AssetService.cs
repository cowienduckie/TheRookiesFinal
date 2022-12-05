using Application.Common.Models;
using Application.DTOs.Assets.GetAsset;
using Application.DTOs.Assets.GetListAssets;
using Application.Services.Interfaces;
using Domain.Entities.Assets;
using Domain.Shared.Constants;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class AssetService : BaseService, IAssetService
{
    private readonly IAssetRepository _assetRepository;

    public AssetService(
        IUnitOfWork unitOfWork,
        IAssetRepository assetRepository) : base(unitOfWork)
    {
        _assetRepository = assetRepository;
    }

    public async Task<Response<GetAssetResponse>> GetAsync(GetAssetRequest request)
    {
        var asset = await _assetRepository
            .GetAsync(a => !a.IsDeleted &&
                            a.Id == request.Id &&
                            a.Location == request.Location);

        if (asset == null)
        {
            return new Response<GetAssetResponse>(false, ErrorMessages.NotFound);
        }

        var responseModel = new GetAssetResponse(asset);

        return new Response<GetAssetResponse>(true, Messages.ActionSuccess, responseModel);
    }

    public async Task<Response<GetListAssetsResponse>> GetListAsync(GetListAssetsRequest request)
    {
        throw new NotImplementedException();
    }
}
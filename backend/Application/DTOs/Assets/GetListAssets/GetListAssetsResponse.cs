using Application.Common.Models;
using Application.DTOs.Assets.GetAsset;

namespace Application.DTOs.Assets.GetListAssets;

public class GetListAssetsResponse
{
    public GetListAssetsResponse(PagedList<GetAssetResponse> pagedList)
    {
        Result = pagedList;
    }

    public PagedList<GetAssetResponse> Result { get; }
}
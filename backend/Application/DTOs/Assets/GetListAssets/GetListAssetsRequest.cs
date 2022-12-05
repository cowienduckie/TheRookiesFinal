using Application.Queries;
using Application.Queries.Assets;
using Domain.Shared.Enums;

namespace Application.DTOs.Assets.GetListAssets;

public class GetListAssetsRequest
{
    public GetListAssetsRequest(
        PagingQuery pagingQuery,
        SortQuery sortQuery,
        SearchQuery searchQuery,
        AssetFilter assetFilter,
        Location location)
    {
        PagingQuery = pagingQuery;
        SortQuery = sortQuery;
        SearchQuery = searchQuery;
        AssetFilter = assetFilter;
        Location = location;
    }

    public PagingQuery PagingQuery { get; }

    public SortQuery SortQuery { get; }

    public SearchQuery SearchQuery { get; }

    public AssetFilter AssetFilter { get; }

    public Location Location { get; }
}
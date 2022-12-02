using Domain.Entities.Assets;
using Domain.Shared.Helpers;

namespace Application.DTOs.Assets.GetAsset;

public class GetAssetResponse
{
    public GetAssetResponse(Asset asset, string category)
    {    
        Id = asset.Id;
        AssetCode = asset.AssetCode;
        Name = asset.Name;
        Category = category;
        Specification = asset.Specification;
        InstalledDate = asset.InstalledDate.ToString("dd/MM/yyyy");
        State = asset.State.GetDescription() ?? asset.State.ToString();
        Location = asset.Location.GetDescription() ?? asset.Location.ToString();
        HasHistoricalAssignment = asset.HasHistoricalAssignment;
    }

    public Guid Id { get; }

    public string AssetCode { get; }

    public string Name { get; }

    public string Category { get; }

    public string Specification { get; }

    public string InstalledDate { get; }

    public string State { get; }

    public string Location { get; }

    public bool HasHistoricalAssignment { get; }
}
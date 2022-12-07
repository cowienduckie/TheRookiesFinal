using Domain.Entities.Assets;
using Domain.Shared.Helpers;

namespace Application.DTOs.Assets.GetAsset;

public class GetAssetResponse
{
    public GetAssetResponse(Asset asset)
    {
        Id = asset.Id;
        AssetCode = asset.AssetCode;
        Name = asset.Name;
        Category = asset.Category.Name;
        Specification = asset.Specification;
        InstalledDate = asset.InstalledDate.ToString("dd/MM/yyyy");
        State = asset.State.GetDescription() ?? asset.State.ToString();
        Location = asset.Location.GetDescription() ?? asset.Location.ToString();
    }

    public Guid Id { get; }

    public string AssetCode { get; }

    public string Name { get; }

    public string Category { get; }

    public string Specification { get; }

    public string InstalledDate { get; }

    public string State { get; }

    public string Location { get; }
}
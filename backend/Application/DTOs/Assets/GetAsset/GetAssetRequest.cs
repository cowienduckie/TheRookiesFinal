using Domain.Shared.Enums;

namespace Application.DTOs.Assets.GetAsset;

public class GetAssetRequest
{
    public Guid Id { get; set; }

    public Location Location { get; set; }
}
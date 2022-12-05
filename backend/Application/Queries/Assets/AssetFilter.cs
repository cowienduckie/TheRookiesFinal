using Domain.Shared.Enums;

namespace Application.Queries.Assets;

public class AssetFilter
{
    public string? AssetState { get; set; }
    public string? Category { get; set; }
}
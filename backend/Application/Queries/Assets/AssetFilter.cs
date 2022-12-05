using Domain.Shared.Enums;

namespace Application.Queries.Assets;

public class AssetFilter
{
    public AssetState? AssetState { get; set; }
    public DateTime? AssignedDate { get; set; }
}
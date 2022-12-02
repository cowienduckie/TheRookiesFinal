using Application.DTOs.Assets.GetAsset;
using Domain.Entities.Assets;
using Domain.Entities.Categories;
using Domain.Shared.Enums;

namespace Application.UnitTests.Common;

public static class AssetConstants
{
    public static readonly Guid Id = new Guid();
    public const string AssetCode = "LA0000001";
    public const string Name = "Sample Asset";
    public static readonly Guid CategoryId = new Guid();
    public const string Specification = "A detailed description";
    public static readonly DateTime InstalledDate = DateTime.Now;
    public static readonly AssetState State = AssetState.Available;
    public static readonly Location Location = Location.HaNoi;
    public const bool HasHistoricalAssignment = true;
    public static readonly Category SampleCategory = new()
    {
        Id = CategoryId,
        Prefix = "LA",
        Name = "Sample Category"
    };
    public static readonly Asset SampleAsset = new()
    {
        Id = Id,
        AssetCode = AssetCode,
        Name = Name,
        CategoryId = CategoryId,
        Category = SampleCategory,
        Specification = Specification,
        InstalledDate = InstalledDate,
        State = State,
        Location = Location,
        HasHistoricalAssignment = HasHistoricalAssignment
    };
    public static GetAssetResponse ExpectedGetResponse => new(SampleAsset);
}
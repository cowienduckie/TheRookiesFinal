using Domain.Entities.Assets;
using Domain.Entities.Categories;
using Domain.Shared.Enums;

namespace Application.UnitTests.Common;

public static class AssetConstants
{
    public static readonly Guid Id = new();
    public static readonly Guid CategoryId = new();
    public const string AssetCode = "LA000001";
    public const string Name = "Sample Asset";
    public const string Specification = "A detailed description";

    public static readonly DateTime InstalledDate = DateTime.Now;
    public static string InstalledDateString => InstalledDate.ToString("dd/MM/yyyy");

    public const AssetState State = AssetState.Available;
    public const string StateString = "Available";

    public const Location AssetLocation = Location.HaNoi;
    public const string LocationString = "Ha Noi";

    public const string CategoryName = "Sample Category";
    public const string CategoryPrefix = "SC";

    public static readonly Category SampleCategory = new()
    {
        Id = CategoryId,
        Prefix = CategoryPrefix,
        Name = CategoryName
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
        Location = AssetLocation
    };
}
using Domain.Shared.Enums;
using Domain.Entities.Assets;

namespace Application.DTOs.Assets.CreateAsset
{
    public class CreateAssetResponse
    {

        public CreateAssetResponse(Asset asset)
        {
            AssetCode = asset.AssetCode;
            Name = asset.Name;
            CategoryId = asset.CategoryId;
            Specification = asset.Specification;
            InstalledDate = asset.InstalledDate;
            State = asset.State;
            Location = asset.Location;
            HasHistoricalAssignment = asset.HasHistoricalAssignment;
            Created = asset.Created;
            CreatedBy = asset.CreatedBy;
            LastModified = asset.LastModified;
            LastModifiedBy = asset.LastModifiedBy;
            IsDeleted = asset.IsDeleted;
        }

        public string AssetCode { get; set; } = null!;

        public string Name { get; set; } = null!;

        public Guid CategoryId { get; set; }

        public string Specification { get; set; } = null!;

        public DateTime InstalledDate { get; set; }

        public AssetState State { get; set; }

        public Location Location { get; set; }

        public bool HasHistoricalAssignment { get; set; } = false;

        public DateTime Created { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? LastModified { get; set; }

        public string? LastModifiedBy { get; set; }

        public bool IsDeleted { get; set; }
    }
}

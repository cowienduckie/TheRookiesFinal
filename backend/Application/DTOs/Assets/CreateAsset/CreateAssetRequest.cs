using Domain.Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Assets.CreateAsset
{
    public class CreateAssetRequest
    {
        [Required]
        public string AssetCode { get; set; } = null!;

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        public string Specification { get; set; } = null!;

        [Required]
        public DateTime InstalledDate { get; set; }

        [Required]
        public AssetState State { get; set; }

        [Required]
        public Location Location { get; set; }

        [Required]
        public bool HasHistoricalAssignment { get; set; } = false;

        [Required]
        public DateTime Created { get; set; }

        public Guid CreatedBy { get; set; }

        public DateTime? LastModified { get; set; }

        public string? LastModifiedBy { get; set; }

        [Required]
        public bool IsDeleted { get; set; }
    }
}

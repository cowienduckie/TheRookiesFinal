using Domain.Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Assets.CreateAsset
{
    public class CreateAssetRequest
    {
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
    }
}

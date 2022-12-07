using System.Data;
using Domain.Base;
using Domain.Entities.Assignments;
using Domain.Entities.Categories;
using Domain.Shared.Enums;

namespace Domain.Entities.Assets;

public class Asset : AuditableEntity<Guid>
{
    public string AssetCode { get; set; } = null!;

    public string Name { get; set; } = null!;

    public Guid CategoryId { get; set; }

    public Category Category { get; set; } = null!;

    public string Specification { get; set; } = null!;

    public DateTime InstalledDate { get; set; }

    public AssetState State { get; set; }

    public Location Location { get; set; }

    public ICollection<Assignment> Assignments { get; set; } = null!;
}
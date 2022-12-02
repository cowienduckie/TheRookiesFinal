using Domain.Base;
using Domain.Entities.Assets;

namespace Domain.Entities.Categories;

public class Category : AuditableEntity<Guid>
{
    public string Prefix { get; set; } = null!;

    public string Name { get; set; } = null!;

    public ICollection<Asset> Assets { get; set; } = null!;
}
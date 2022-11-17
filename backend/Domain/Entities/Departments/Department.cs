using Domain.Base;

namespace Domain.Entities.Departments;

public partial class Department : BaseEntity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
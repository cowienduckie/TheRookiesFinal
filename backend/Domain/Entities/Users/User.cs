using Domain.Base;
using Domain.Shared.Enums;

namespace Domain.Entities.Users;

public class User : AuditableEntity<Guid>
{
    public string Username { get; set; } = null!;

    public string HashedPassword { get; set; } = null!;

    public UserRoles Role { get; set; }

    public bool IsFirstTimeLogIn { get; set; } = true;
}
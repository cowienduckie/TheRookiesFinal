using Domain.Base;
using Domain.Shared.Enums;

namespace Domain.Entities.Users;

public class User : AuditableEntity<Guid>
{
    public string StaffCode { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string HashedPassword { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public Genders Gender { get; set; }

    public DateTime JoinedDate { get; set; }

    public UserRoles Role { get; set; }

    public Locations Location { get; set; }

    public bool IsFirstTimeLogIn { get; set; } = true;
}
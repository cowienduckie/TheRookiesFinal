using Domain.Entities.Users;
using Domain.Shared.Enums;

namespace Application.Common.Models;

public class UserInternalModel
{
    public UserInternalModel(User user)
    {
        Id = user.Id;
        Role = user.Role;
        Location = user.Location;
    }

    public Guid Id { get; }

    public UserRoles Role { get; }

    public Locations Location { get; }
}
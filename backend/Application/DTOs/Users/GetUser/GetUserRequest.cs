using Domain.Shared.Enums;

namespace Application.DTOs.Users.GetUser;

public class GetUserRequest
{
    public Guid Id { get; set; }

    public Location Location { get; set; }
}
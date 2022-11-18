using Domain.Entities.Users;

namespace Application.DTOs.Users.GetUser;

public class GetUserResponse
{
    public GetUserResponse(User user)
    {
        Id = user.Id;
        Username = user.Username;
        Role = user.Role.ToString();
    }

    public Guid Id { get; }

    public string Username { get; }

    public string Role { get; }
}
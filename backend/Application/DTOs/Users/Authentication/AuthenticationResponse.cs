using Domain.Entities.Users;

namespace Application.DTOs.Users.Authentication;

public class AuthenticationResponse
{
    public AuthenticationResponse(User user, string token)
    {
        Id = user.Id;
        Username = user.Username;
        Role = user.Role.ToString();
        Token = token;
        IsFirstTimeLogin = user.IsFirstTimeLogIn;
    }

    public Guid Id { get; }

    public string Username { get; }

    public string Role { get; }

    public string Token { get; }

    public bool IsFirstTimeLogin { get; }
}
namespace Application.DTOs.Users.GetUser;

public class GetUserResponse
{
    public Guid Id { get; set; }

    public string Username { get; set; } = null!;

    public string Role { get; set; } = null!;
}
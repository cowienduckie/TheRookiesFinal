using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Users.Authentication;

public class AuthenticationRequest
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = null!;
}
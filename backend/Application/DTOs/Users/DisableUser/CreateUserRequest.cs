using Domain.Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Users.CreateUser;

public class DisableUserRequest
{
    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;
}
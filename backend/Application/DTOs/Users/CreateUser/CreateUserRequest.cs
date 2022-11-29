using Domain.Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Users.CreateUser;

public class CreateUserRequest
{
    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    public Genders Gender { get; set; }

    [Required]
    public DateTime JoinedDate { get; set; }

    public UserRoles Role { get; set; }

    public Locations Location { get; set; }
}
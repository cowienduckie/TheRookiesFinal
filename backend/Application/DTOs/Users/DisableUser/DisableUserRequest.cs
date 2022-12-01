using System.ComponentModel.DataAnnotations;
using Domain.Shared.Enums;

namespace Application.DTOs.Users.DisableUser;

public class DisableUserRequest
{
    [Required]
    public Guid Id { get; set; }

    public Location Location { get; set; }
}
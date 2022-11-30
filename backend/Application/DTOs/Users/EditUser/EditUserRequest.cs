using Domain.Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Users.EditUser
{
    public class EditUserRequest
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public Gender Gender { get; set; }

        [Required]
        public DateTime JoinedDate { get; set; }

        [Required]
        public UserRole Role { get; set; }

        public Location AdminLocation { get; set; }
    }
}

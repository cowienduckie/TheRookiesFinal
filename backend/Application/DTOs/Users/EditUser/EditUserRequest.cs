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
        public Genders Gender { get; set; }

        [Required]
        public DateTime JoinedDate { get; set; }

        [Required]
        public UserRoles Role { get; set; }

        public Locations AdminLocation { get; set; }
    }
}

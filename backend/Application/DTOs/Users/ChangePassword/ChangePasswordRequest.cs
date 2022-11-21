using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Users.ChangePassword
{
    public class ChangePasswordRequest
    {
        [Required]
        public Guid Id { get; set; }

        public string OldPassword { get; set; } = null!;

        [Required]
        public string NewPassword { get; set; } = null!;
    }
}

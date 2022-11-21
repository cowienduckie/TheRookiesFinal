using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Users.ChangePassword
{
    public class ChangePasswordRequest
    {
        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string OldPassword { get; set; } = null!;

        [Required]
        public string NewPassword { get; set; } = null!;
    }
}

using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Users.ChangePassword
{
    public class ChangePasswordRequest
    {
        public Guid? Id { get; set; }

        public string OldPassword { get; set; } = string.Empty;

        [Required]
        public string NewPassword { get; set; } = null!;
    }
}

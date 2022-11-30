using Domain.Shared.Enums;

namespace Application.DTOs.Users.EditUser
{
    public class EditUserResponse
    {
        public Guid Id { get; }

        public string FirstName { get; } = null!;

        public string LastName { get; } = null!;

        public DateTime DateOfBirth { get; }

        public Gender Gender { get; }

        public DateTime JoinedDate { get; }

        public UserRole Role { get; }
    }
}

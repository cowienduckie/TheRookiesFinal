using Domain.Entities.Users;
using Domain.Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Users.CreateUser;

public class CreateUserResponse
{
    public CreateUserResponse(User user)
    {
        Id = user.Id;
        StaffCode = user.StaffCode;
        FirstName = user.FirstName;
        LastName = user.LastName;
        DateOfBirth = user.DateOfBirth;
        Gender = user.Gender;
        JoinedDate = user.JoinedDate;
        Role = user.Role;
        Location = user.Location;
        IsFirstTimeLogIn = user.IsFirstTimeLogIn;
    }

    public Guid Id { get; }

    public string StaffCode { get; }

    public string FirstName { get; }

    public string LastName { get; }

    public DateTime DateOfBirth { get; }

    public Gender Gender { get; }

    public DateTime JoinedDate { get; }

    public UserRole Role { get; }

    public Location Location { get; }

    public bool IsFirstTimeLogIn { get; }
}
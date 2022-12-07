using Domain.Entities.Users;
using Domain.Shared.Enums;
using Domain.Shared.Helpers;

namespace Application.UnitTests.Common;

public static class Constants
{
    public const string Username = "Username";
    public const string Password = "Password";
    public const string OldPassword = "Password";
    public const string NewPassword = "Password";
    public const UserRole Role = UserRole.Admin;
    public const string StaffCode = "SD0001";
    public const string FirstName = "Firstname";
    public const string LastName = "Last Name";
    public const string NewUserName = "namefl";
    public const string NewCreatePassword = "namefl@05102002";
    public const Gender NewGender = Gender.Male;
    public const Location NewLocation = Location.HaNoi;
    public const bool IsFirstTimeLogIn = true;

    public static readonly User SampleUser = new()
    {
        Id = Guid.NewGuid(),
        StaffCode = StaffCode,
        FirstName = FirstName,
        LastName = LastName,
        Username = NewUserName,
        HashedPassword = HashStringHelper.HashString(Password),
        DateOfBirth = new DateTime(2002, 10, 5),
        Gender = NewGender,
        JoinedDate = new DateTime(2022, 12, 1),
        Role = Role,
        Location = NewLocation,
        IsFirstTimeLogIn = true,
    };
}
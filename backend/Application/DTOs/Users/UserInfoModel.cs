using Domain.Entities.Users;

namespace Application.DTOs.Users;

public class UserInfoModel
{
    public UserInfoModel(User user)
    {
        Id = user.Id;
        Username = user.Username;
        StaffCode = user.StaffCode;
        FirstName = user.FirstName;
        LastName = user.LastName;
        JoinedDate = user.JoinedDate;
        Role = user.Role.ToString();
    }

    public Guid Id { get; set; }

    public string Username { get; set;}

    public string StaffCode { get; set;}

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName => $"{FirstName} {LastName}";

    public DateTime JoinedDate { get; set; }

    public string Role { get; set; }
}
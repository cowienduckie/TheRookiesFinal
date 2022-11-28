using Domain.Entities.Users;

namespace Application.DTOs.Users.GetUser;

public class GetUserResponse
{
    public GetUserResponse(User user)
    {
        Id = user.Id;
        Username = user.Username;
        StaffCode = user.StaffCode;
        FirstName = user.FirstName;
        LastName = user.LastName;
        DateOfBirth = user.DateOfBirth;
        Gender = user.Gender.ToString();
        JoinedDate = user.JoinedDate;
        Role = user.Role.ToString();
        Location = user.Location.ToString();
    }

    public Guid Id { get; set; }

    public string Username { get; set;}

    public string StaffCode { get; set;}

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName => $"{FirstName} {LastName}";

    public DateTime DateOfBirth { get; set; }

    public string Gender { get; set; }

    public DateTime JoinedDate { get; set; }

    public string Role { get; set; }

    public string Location { get; set; }
}
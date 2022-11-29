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
        DateOfBirth = user.DateOfBirth.ToString("dd/MM/yyyy");
        Gender = user.Gender.ToString();
        JoinedDate = user.JoinedDate.ToString("dd/MM/yyyy");
        Role = user.Role.ToString();
        Location = user.Location.ToString();
    }

    public Guid Id { get; set; }

    public string Username { get; set; }

    public string StaffCode { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName => $"{FirstName} {LastName}";

    public string DateOfBirth { get; set; }

    public string Gender { get; set; }

    public string JoinedDate { get; set; }

    public string Role { get; set; }

    public string Location { get; set; }
}
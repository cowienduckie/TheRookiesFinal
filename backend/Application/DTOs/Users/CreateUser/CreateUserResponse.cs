﻿using Domain.Entities.Users;
using Domain.Shared.Enums;

namespace Application.DTOs.Users.CreateUser;

public class CreateUserResponse
{
    public CreateUserResponse(User user)
    {
        Id = user.Id;
        Username = user.Username;
        StaffCode = user.StaffCode;
        FirstName = user.FirstName;
        LastName = user.LastName;
        FullName = user.FullName;
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

    public string FullName { get; set; }

    public string DateOfBirth { get; set; }

    public string Gender { get; set; }

    public string JoinedDate { get; set; }

    public string Role { get; set; }

    public string Location { get; set; }
}
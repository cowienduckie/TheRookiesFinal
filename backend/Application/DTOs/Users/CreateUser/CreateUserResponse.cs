﻿using Domain.Entities.Users;
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
        Username = user.Username;
        HashedPassword = user.HashedPassword;
        DateOfBirth = user.DateOfBirth;
        Gender = user.Gender;
        JoinedDate = user.JoinedDate;
        Role = user.Role;
        Location = user.Location;
        IsFirstTimeLogIn = user.IsFirstTimeLogIn;
    }

    public Guid Id { get; }

    public string? StaffCode { get; }

    public string? FirstName { get; }

    public string? LastName { get; }

    public string? Username { get; }

    public string? HashedPassword { get; }

    public DateTime DateOfBirth { get; }

    public Genders Gender { get; }

    public DateTime JoinedDate { get; }

    public UserRoles Role { get; }

    public Locations Location { get; }

    public bool IsFirstTimeLogIn { get; }
}
﻿namespace Domain.Shared.Constants;

public static class ErrorMessages
{
    public const string InternalServerError = "Internal Server Error!";
    public const string LoginFailed = "Username or password is incorrect!";
    public const string Unauthorized = "Unauthorized";
    public const string NotFound = "Not Found";
    public const string BadRequest = "Bad request!";

    public const string MatchingOldAndNewPassword = "The new password cannot match the old password!";
    public const string WrongOldPassword = "Old password is wrong!";

    public const string InvalidAge = "User's age is invalid!";
    public const string InvalidJoinedDate = "Joined date is invalid!";
}
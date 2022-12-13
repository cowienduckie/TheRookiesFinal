namespace Domain.Shared.Constants;

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
    public const string CannotDisableUser =
        "There are valid assignments belongings to this user. Please close all assignments before disabling user.";
    public const string InvalidLocation = "Location is invalid!";
    public const string InvalidCategoryPrefix = "Category prefix is invalid!";
    public const string DuplicateCategoryPrefix = "Prefix is already existed. Please enter a different prefix!";
    public const string DuplicateCategoryName = "Category is already existed. Please enter a different category!";
    public const string UnexistedCategory = "Category is not existed!";
    public const string InvalidState = "State of assignment is not waiting!";
    public const string InvalidStateReturn = "State of assignment is not accepted!";
    public const string CannotDeleteAsset = "There are valid assignments relating to this asset. Please close all assignments before deleting this asset.";
    public const string CannotDeleteAssignment = "Current assignment is not on valid state. Please change it to Waiting to accepted or Declined in order to continue!";
}
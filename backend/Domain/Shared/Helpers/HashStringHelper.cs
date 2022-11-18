namespace Domain.Shared.Helpers;

public static class HashStringHelper
{
    public static string HashString(string input)
    {
        return BCrypt.Net.BCrypt.HashPassword(input);
    }

    public static bool IsValid(string input, string hashed)
    {
        return BCrypt.Net.BCrypt.Verify(input, hashed);
    }
}
namespace Domain.Shared.Constants;

public static class JwtSettings
{
    public const string SecurityKey = "JWT Token Security Key";
    public const int ExpiredTimeInDay = 7;
    public const string Issuer = "Book Library Server";
    public const string Audience = "Book Library Client";
    public const string IdTokenClaimName = "Id";
}
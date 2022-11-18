using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities.Users;
using Domain.Shared.Constants;
using Microsoft.IdentityModel.Tokens;

namespace Domain.Shared.Helpers;

public static class JwtHelper
{
        private static readonly byte[] SecurityKey = Encoding.ASCII.GetBytes(JwtSettings.SecurityKey);

    public static string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(JwtSettings.IdTokenClaimName, user.Id.ToString())
            }),

            Expires = DateTime.UtcNow
                .AddDays(JwtSettings.ExpiredTimeInDay),

            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(SecurityKey),
                SecurityAlgorithms.HmacSha256Signature),

            Issuer = JwtSettings.Issuer,
            Audience = JwtSettings.Audience
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public static Guid? ValidateJwtToken(string? token)
    {
        if (token == null) return null;

        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(SecurityKey),
                    ValidateIssuer = true,
                    ValidIssuer = JwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = JwtSettings.Audience,
                    ClockSkew = TimeSpan.Zero
                },
                out var validatedToken);

            var jwtToken = (JwtSecurityToken) validatedToken;

            var userId = Guid.Parse(jwtToken.Claims
                .First(c => c.Type == JwtSettings.IdTokenClaimName)
                .Value);

            return userId;
        }
        catch
        {
            return null;
        }
}
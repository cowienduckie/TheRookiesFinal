using Application.Services.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Helpers;

namespace API.Middlewares;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IUserService userService)
    {
        var token = context.Request.Headers[Settings.AuthorizationRequestHeader]
            .FirstOrDefault()
            ?.Split(" ")
            .Last();

        var userId = JwtHelper.ValidateJwtToken(token);

        if (userId != null)
        {
            context.Items[Settings.CurrentUserContextKey] = await userService.GetInternalModelByIdAsync(userId.Value);
        }

        await _next(context);
    }
}
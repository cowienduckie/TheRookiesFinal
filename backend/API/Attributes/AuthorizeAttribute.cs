using Application.Common.Models;
using Domain.Shared.Constants;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Domain.Shared.Enums;

namespace API.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private readonly IList<UserRoles> _roles;

    public AuthorizeAttribute(params UserRoles[]? roles)
    {
        _roles = roles ?? Array.Empty<UserRoles>();
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var isAnonymousAllowed = context
                                .ActionDescriptor
                                .EndpointMetadata
                                .OfType<AllowAnonymousAttribute>()
                                .Any();

        if (isAnonymousAllowed)
        {
            return;
        }

        var user = context.HttpContext.Items[Settings.CurrentUserContextKey] as UserInternalModel;

        if (user == null || (_roles.Any() && !_roles.Contains(user.Role)))
        {
            context.Result = new UnauthorizedResult();
        }
    }
}
using Application.Common.Models;
using Domain.Shared.Constants;
using Infrastructure.Common.Interfaces;

namespace API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId => (_httpContextAccessor
                                .HttpContext
                                ?.Items[Settings.CurrentUserContextKey] as UserInternalModel)
                                ?.Id
                                .ToString();
}
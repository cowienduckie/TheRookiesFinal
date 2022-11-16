using API.Services;
using Infrastructure.Common.Interfaces;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddWebUiServices(this IServiceCollection services)
    {
        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddSingleton<ICurrentUserService, CurrentUserService>();

        services.AddHttpContextAccessor();

        services.AddHealthChecks()
            .AddDbContextCheck<EfContext>();

        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

        return services;
    }
}
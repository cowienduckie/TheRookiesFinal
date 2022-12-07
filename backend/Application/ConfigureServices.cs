using Application.Services;
using Application.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class ConfigureServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddTransient<IAssetService, AssetService>();
        services.AddTransient<IAssignmentService, AssignmentService>();
        services.AddTransient<ICategoryService, CategoryService>();
        services.AddTransient<IRequestForReturningService, RequestForReturningService>();

        return services;
    }
}
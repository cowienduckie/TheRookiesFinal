using Domain.Entities.Departments;
using Domain.Interfaces;
using Infrastructure.Common.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Persistence.Interfaces;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<AuditableEntitySaveChangesInterceptor>();

        services.AddDbContext<EfContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("RookiesConnectionString"),
                builder => builder.MigrationsAssembly(typeof(EfContext).Assembly.FullName)));

        services.AddScoped(provider => provider.GetRequiredService<EfContext>());

        services.AddScoped(typeof(IAsyncRepository<>), typeof(RepositoryBase<>))
            .AddScoped<IDepartmentRepository, DepartmentRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<EfContextInitializer>();

        services.AddTransient<IDateTime, DateTimeService>();

        return services;
    }
}
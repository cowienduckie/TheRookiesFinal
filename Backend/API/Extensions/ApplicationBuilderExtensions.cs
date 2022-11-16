using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication MigrateDatabase(this WebApplication webApp)
    {
        using IServiceScope scope = webApp.Services.CreateScope();
        using EfContext appContext = scope.ServiceProvider.GetRequiredService<EfContext>();

        appContext.Database.Migrate();

        return webApp;
    }
}
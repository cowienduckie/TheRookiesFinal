using Domain.Shared.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence;

public class EfContextInitializer
{
    private readonly EfContext _context;
    private readonly ILogger<EfContextInitializer> _logger;

    public EfContextInitializer(
        ILogger<EfContextInitializer> logger,
        EfContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task InitializeAsync()
    {
        try
        {
            if (_context.Database.IsSqlServer()) await _context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task TrySeedAsync()
    {
        //if (!_context.Users.Any())
        //{
        //    _context.Users.Add(new User
        //    {
        //        Username = "admin",
        //        HashedPassword = HashStringHelper.HashString("admin"),
        //        Role = UserRoles.Admin
        //    });

        //    _context.Users.Add(new User
        //    {
        //        Username = "staff",
        //        HashedPassword = HashStringHelper.HashString("staff"),
        //        Role = UserRoles.Staff
        //    });

        //    await _context.SaveChangesAsync();
        //}

        //var userdat = _context.Users.FirstOrDefault(u => u.Username == "dat");
        //userdat.HashedPassword = HashStringHelper.HashString("123");
        //await _context.SaveChangesAsync();
    }
}
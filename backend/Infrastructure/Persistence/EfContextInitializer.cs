using Domain.Entities.Users;
using Domain.Shared.Enums;
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
            if (_context.Database.IsSqlServer())
            {
                await _context.Database.MigrateAsync();
            }
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
        if (!_context.Users.Any())
        {
            _context.Users.Add(new User
            {
                StaffCode = "SD0001",
                FirstName = "Admin",
                LastName = "Ha Noi",
                Username = "adminhn",
                HashedPassword = HashStringHelper.HashString("Admin@123"),
                DateOfBirth = DateTime.Now.AddYears(-18),
                Gender = Gender.Male,
                JoinedDate = DateTime.Now,
                Role = UserRole.Admin,
                Location = Location.HaNoi,
            });

            _context.Users.Add(new User
            {
                StaffCode = "SD0002",
                FirstName = "Admin",
                LastName = "Ho Chi Minh",
                Username = "adminhcm",
                HashedPassword = HashStringHelper.HashString("Admin@123"),
                DateOfBirth = DateTime.Now.AddYears(-18),
                Gender = Gender.Female,
                JoinedDate = DateTime.Now,
                Role = UserRole.Admin,
                Location = Location.HCMCity,
            });

            await _context.SaveChangesAsync();
        }
    }
}
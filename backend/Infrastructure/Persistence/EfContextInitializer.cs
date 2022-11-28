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
            for (int i = 1; i <= 10; i++)
            {
                var adminCode = i.ToString().PadLeft(4, '0');
                var userCode = (2 * i).ToString().PadLeft(4, '0');
                var now = DateTime.Now;

                _context.Users.Add(new User
                {
                    StaffCode = $"SD{adminCode}",
                    FirstName = "Admin",
                    LastName = adminCode,
                    Username = $"admin{i}",
                    HashedPassword = HashStringHelper.HashString("Admin@123"),
                    DateOfBirth = now.AddYears(-18),
                    Gender = i % 2 == 0 ? Genders.Female : Genders.Male,
                    JoinedDate = now,
                    Role = UserRoles.Admin,
                    Location = i % 2 == 0 ? Locations.HaNoi : Locations.HCMCity,
                });

                _context.Users.Add(new User
                {
                    StaffCode = $"SD{userCode}",
                    FirstName = "Staff",
                    LastName = userCode,
                    Username = $"staff{i}",
                    HashedPassword = HashStringHelper.HashString("Staff@123"),
                    DateOfBirth = now.AddYears(-18),
                    Gender = i % 2 == 0 ? Genders.Male : Genders.Female,
                    JoinedDate = now,
                    Role = UserRoles.Staff,
                    Location = i % 2 == 0 ? Locations.HaNoi : Locations.HCMCity,
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
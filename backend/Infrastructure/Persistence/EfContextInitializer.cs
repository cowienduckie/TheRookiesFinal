using Domain.Entities.Assets;
using Domain.Entities.Categories;
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

        if (!_context.Assets.Any() && !_context.Categories.Any())
        {
            var laptopCategory = _context.Categories.Add(new Category
            {
                Prefix = "LA",
                Name = "Laptop"
            }).Entity;

            var pcCategory = _context.Categories.Add(new Category
            {
                Prefix = "PC",
                Name = "Personal Computer"
            }).Entity;

            _context.Assets.Add(new Asset
            {
                AssetCode = "LA0000001",
                Name = "MacBook Pro 2015",
                Category = laptopCategory,
                Specification = "15-inch, Core i7, 16GB RAM, 256GB SSD, MacOs",
                InstalledDate = DateTime.Now,
                State = AssetState.Available,
                Location = Location.HaNoi,
                HasHistoricalAssignment = false
            });

            _context.Assets.Add(new Asset
            {
                AssetCode = "LA0000003",
                Name = "ThinkPad X1 Nano",
                Category = laptopCategory,
                Specification = "13-inch, Core i7, 32GB RAM, 512GB SSD, Windows 10",
                InstalledDate = DateTime.Now,
                State = AssetState.NotAvailable,
                Location = Location.HaNoi,
                HasHistoricalAssignment = true
            });

            _context.Assets.Add(new Asset
            {
                AssetCode = "PC0000001",
                Name = "Mid-tier Personal Computer",
                Category = pcCategory,
                Specification = "Core i5, 16GB RAM, 256GB SSD, 512GB HDD, Windows 10",
                InstalledDate = DateTime.Now,
                State = AssetState.WaitingForRecycling,
                Location = Location.HaNoi,
                HasHistoricalAssignment = false
            });

            _context.Assets.Add(new Asset
            {
                AssetCode = "LA0000002",
                Name = "Dell XPS 9370",
                Category = laptopCategory,
                Specification = "13-inch, Core i5, 16GB RAM, 512GB SSD, Windows 11",
                InstalledDate = DateTime.Now,
                State = AssetState.Available,
                Location = Location.HCMCity,
                HasHistoricalAssignment = false
            });

            await _context.SaveChangesAsync();
        }
    }
}
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence;

public class EfContextInitializer
{
    private readonly ILogger<EfContextInitializer> _logger;
    private readonly EfContext _context;

    public EfContextInitializer(
        ILogger<EfContextInitializer> logger,
        EfContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task InitialiseAsync()
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

    public async Task TrySeedAsync()
    {
        //// Default roles
        //var administratorRole = new ApplicationRole
        //{
        //    Name = UserRoles.Admin
        //};

        //if (_roleManager.Roles.All(r => r.Name != administratorRole.Name))
        //{
        //    await _roleManager.CreateAsync(administratorRole);
        //}

        //// Default users
        //var administrator = new ApplicationUser
        //{
        //    UserName = "administrator@localhost",
        //    Email = "administrator@localhost",
        //    DepartmentId = (Guid?)null,
        //    FirstName = "admin",
        //    LastName = "admin"
        //};

        //if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        //{
        //    await _userManager.CreateAsync(administrator, "Administrator1!");
        //    await _userManager.AddToRolesAsync(administrator, new[] { administratorRole.Name });
        //}

        // Default data
        // Seed, if necessary
        //if (!_context.Users.Any())
        //{
        //    using (var transaction = _context.Database.BeginTransaction())
        //    {
        //        _context.Departments.Add(new Domain.Entities.Departments.Department { Id = 1, Description = "IT", Name = "IT" });
        //        _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.Departments ON;");
        //        await _context.SaveChangesAsync();
        //        _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.Departments OFF;");
        //        transaction.Commit();
        //    }

        //    _context.Users.Add(new User
        //    {
        //        UserName = "admin",
        //        Address = "HY",
        //        FirstName = "Admin",
        //        LastName = "Admin",
        //        DepartmentId = 1
        //    });

        //    await _context.SaveChangesAsync();
        //}
    }
}
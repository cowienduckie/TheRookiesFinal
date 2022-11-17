using System.Reflection;
using Domain.Entities.Departments;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence;

public class EfContext : DbContext, IEfContext
{
    private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;

    public EfContext() : base(CreateOptions(""))
    {
    }

    public EfContext(string connName) : base(CreateOptions(connName))
    {
    }

    public EfContext(DbContextOptions<EfContext> options,
        AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor) : base(
        options ?? CreateOptions(""))
    {
        _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
    }

    public virtual DbSet<Department> Departments => Set<Department>();

    private static DbContextOptions<EfContext> CreateOptions(string connName)
    {
        DbContextOptionsBuilder<EfContext> optionsBuilder = new();

        if (string.IsNullOrWhiteSpace(connName))
        {
            IConfigurationRoot configuration = new ConfigurationBuilder().Build();
            connName = configuration.GetConnectionString("RookiesConnectionString");
        }

        optionsBuilder.UseSqlServer(connName);

        return optionsBuilder.Options;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }
}
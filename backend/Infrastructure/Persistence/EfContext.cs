using System.Reflection;
using Domain.Entities.Assets;
using Domain.Entities.Assignments;
using Domain.Entities.Categories;
using Domain.Entities.RequestsForReturning;
using Domain.Entities.Users;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class EfContext : DbContext, IEfContext
{
    private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;

    public EfContext(
        DbContextOptions<EfContext> options,
        AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor)
        : base(options)
    {
        _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
    }

    public virtual DbSet<User> Users => Set<User>();
    public virtual DbSet<Assignment> Assignments => Set<Assignment>();
    public virtual DbSet<Asset> Assets => Set<Asset>();
    public virtual DbSet<Category> Categories => Set<Category>();
    public virtual DbSet<RequestForReturning> RequestsForReturning => Set<RequestForReturning>();

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
using Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Persistence;

public class EntityDatabaseTransaction : IDatabaseTransaction
{
    private readonly IDbContextTransaction _transaction;

    public EntityDatabaseTransaction(DbContext context)
    {
        _transaction = context.Database.BeginTransaction();
    }

    public async Task CommitAsync()
    {
        await _transaction.CommitAsync();
    }

    public async Task RollbackAsync()
    {
        await _transaction.RollbackAsync();
    }

    public void Dispose()
    {
        _transaction.Dispose();
        GC.SuppressFinalize(this);
    }
}
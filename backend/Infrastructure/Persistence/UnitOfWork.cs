using Domain.Interfaces;
using Infrastructure.Persistence.Interfaces;
using Infrastructure.Persistence.Repositories;

namespace Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly EfContext _dbContext;

    public UnitOfWork(EfContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IAsyncRepository<T> AsyncRepository<T>() where T : class
    {
        return new RepositoryBase<T>(_dbContext);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}
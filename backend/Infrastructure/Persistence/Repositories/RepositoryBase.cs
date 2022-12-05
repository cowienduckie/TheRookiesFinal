using System.Linq.Expressions;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class RepositoryBase<T> : IAsyncRepository<T> where T :class
{
    protected readonly DbSet<T> _dbSet;

    public RepositoryBase(EfContext dbContext)
    {
        _dbSet = dbContext.Set<T>();
    }

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        return entity;
    }

    public Task<bool> DeleteAsync(T entity)
    {
        _dbSet.Remove(entity);
        return Task.FromResult(true);
    }

    public Task<T?> GetAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default)
    {
        return predicate != null ? _dbSet.FirstOrDefaultAsync(predicate, cancellationToken) : _dbSet.FirstOrDefaultAsync(cancellationToken);
    }

    public Task<List<T>> ListAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default)
    {
        return predicate != null ? _dbSet.Where(predicate).ToListAsync(cancellationToken) : _dbSet.ToListAsync(cancellationToken);
    }

    public Task<T> UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        return Task.FromResult(entity);
    }
}
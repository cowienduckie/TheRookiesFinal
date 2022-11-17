using System.Linq.Expressions;

namespace Domain.Interfaces;

public interface IAsyncRepository<T> where T : class
{
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(T entity);
    Task<T?> GetAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default);
    Task<List<T>> ListAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default);
}
using Domain.Interfaces;

namespace Infrastructure.Persistence.Interfaces;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    IAsyncRepository<T> AsyncRepository<T>() where T : class;
}
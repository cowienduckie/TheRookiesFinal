namespace Infrastructure.Persistence.Interfaces;

public interface IEfContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
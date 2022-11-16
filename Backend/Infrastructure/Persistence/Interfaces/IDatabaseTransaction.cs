namespace Infrastructure.Persistence.Interfaces;

public interface IDatabaseTransaction : IDisposable
{
    Task CommitAsync();
    Task RollbackAsync();
}
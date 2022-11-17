namespace Infrastructure.Persistence.Interfaces;

public interface IEfContext
{
    Task InitialiseAsync();
}
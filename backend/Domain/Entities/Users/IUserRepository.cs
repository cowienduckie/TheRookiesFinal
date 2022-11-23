using Domain.Interfaces;

namespace Domain.Entities.Users;

public interface IUserRepository : IAsyncRepository<User>
{
}
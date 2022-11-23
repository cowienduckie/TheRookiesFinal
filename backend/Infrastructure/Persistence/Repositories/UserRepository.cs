using Domain.Entities.Users;

namespace Infrastructure.Persistence.Repositories;

public class UserRepository : RepositoryBase<User>, IUserRepository
{
    public UserRepository(EfContext dbContext) : base(dbContext)
    {
    }
}
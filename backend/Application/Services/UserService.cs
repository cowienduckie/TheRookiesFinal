using Application.Services.Interfaces;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class UserService : BaseService, IUserService
{
    public UserService(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }
}
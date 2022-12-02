using Application.Services.Interfaces;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class AssignmentService : BaseService, IAssignmentService
{
    public AssignmentService(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }
}
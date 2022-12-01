using Domain.Entities.Assignments;

namespace Infrastructure.Persistence.Repositories;

public class AssignmentRepository : RepositoryBase<Assignment>, IAssignmentRepository
{
    public AssignmentRepository(EfContext dbContext) : base(dbContext)
    {
    }
}
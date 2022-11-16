using Domain.Entities.Departments;

namespace Infrastructure.Persistence.Repositories;

public class DepartmentRepository : RepositoryBase<Department>, IDepartmentRepository
{
    public DepartmentRepository(EfContext dbContext) : base(dbContext)
    {
    }
}
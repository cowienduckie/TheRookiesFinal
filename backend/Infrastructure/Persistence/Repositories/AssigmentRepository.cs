using Domain.Entities.Assignments;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class AssignmentRepository : RepositoryBase<Assignment>, IAssignmentRepository
{
    public AssignmentRepository(EfContext dbContext) : base(dbContext)
    {
    }

    public new async Task<Assignment?> GetAsync(
        Expression<Func<Assignment, bool>>? predicate = null,
        CancellationToken cancellationToken = default)
    {
        var dbSet = predicate == null ? _dbSet : _dbSet.Where(predicate);

        return await dbSet
            .Include(a => a.Asset)
            .Include(a => a.Assignee)
            .Include(a => a.Assigner)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public new async Task<List<Assignment>> ListAsync(
        Expression<Func<Assignment, bool>>? predicate = null,
        CancellationToken cancellationToken = default)
    {
        var dbSet = predicate == null ? _dbSet : _dbSet.Where(predicate);

        return await dbSet
            .Include(a => a.Asset)
            .Include(a => a.Assignee)
            .Include(a => a.Assigner)
            .ToListAsync(cancellationToken);
    }
}
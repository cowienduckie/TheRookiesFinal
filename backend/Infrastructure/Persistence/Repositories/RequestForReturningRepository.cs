using Domain.Entities.RequestsForReturning;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class RequestForReturningRepository : RepositoryBase<RequestForReturning>, IRequestForReturningRepository
{
    public RequestForReturningRepository(EfContext dbContext) : base(dbContext)
    {
    }

    public new async Task<RequestForReturning?> GetAsync(
        Expression<Func<RequestForReturning, bool>>? predicate = null,
        CancellationToken cancellationToken = default)
    {
        var dbSet = predicate == null ? _dbSet : _dbSet.Where(predicate);

        return await dbSet
            .Include(r => r.Assignment)
                .ThenInclude(a => a.Asset)
            .Include(r => r.Requester)
            .Include(r => r.Approver)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public new async Task<List<RequestForReturning>> ListAsync(
        Expression<Func<RequestForReturning, bool>>? predicate = null,
        CancellationToken cancellationToken = default)
    {
        var dbSet = predicate == null ? _dbSet : _dbSet.Where(predicate);

        return await dbSet
            .Include(r => r.Assignment)
                .ThenInclude(a => a.Asset)
            .Include(r => r.Requester)
            .Include(r => r.Approver)
            .ToListAsync(cancellationToken);
    }
}
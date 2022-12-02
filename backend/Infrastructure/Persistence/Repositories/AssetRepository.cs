using System.Linq.Expressions;
using Domain.Entities.Assets;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class AssetRepository : RepositoryBase<Asset>, IAssetRepository
{
    public AssetRepository(EfContext dbContext) : base(dbContext)
    {
    }

    public new async Task<Asset?> GetAsync(
        Expression<Func<Asset, bool>>? predicate = null, 
        CancellationToken cancellationToken = default)
    {
        var dbSet = predicate == null ? _dbSet : _dbSet.Where(predicate);

        return await dbSet.Include(a => a.Category).FirstOrDefaultAsync();
    }
}
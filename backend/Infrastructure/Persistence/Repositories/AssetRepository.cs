using Domain.Entities.Assets;

namespace Infrastructure.Persistence.Repositories;

public class AssetRepository : RepositoryBase<Asset>, IAssetRepository
{
    public AssetRepository(EfContext dbContext) : base(dbContext)
    {
    }
}
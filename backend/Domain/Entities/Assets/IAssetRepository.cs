using Domain.Interfaces;

namespace Domain.Entities.Assets;

public interface IAssetRepository : IAsyncRepository<Asset>
{
}
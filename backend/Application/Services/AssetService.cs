using Application.Services.Interfaces;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class AssetService : BaseService, IAssetService
{
    public AssetService(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }
}
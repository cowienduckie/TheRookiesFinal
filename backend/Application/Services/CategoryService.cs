using Application.Services.Interfaces;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class CategoryService : BaseService, ICategoryService
{
    public CategoryService(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }
}
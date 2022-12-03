using Domain.Entities.Categories;

namespace Infrastructure.Persistence.Repositories;

public class CategoryRepository : RepositoryBase<Category>, ICategoryRepository
{
    public CategoryRepository(EfContext dbContext) : base(dbContext)
    {
    }
}
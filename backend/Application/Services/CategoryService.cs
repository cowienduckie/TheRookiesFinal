using Application.Common.Models;
using Application.DTOs.Categories.GetCategories;
using Application.Services.Interfaces;
using Domain.Entities.Categories;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class CategoryService : BaseService, ICategoryService
{
    public CategoryService(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    public async Task<Response<List<GetCategoryResponse>>> GetAllAsync()
    {
        var categoryRepository = UnitOfWork.AsyncRepository<Category>();

        var categories =  (await categoryRepository.ListAsync(c => !c.IsDeleted))
                            .Select(c => new GetCategoryResponse(c))
                            .ToList();

        return new Response<List<GetCategoryResponse>>(true, categories);
    }
}
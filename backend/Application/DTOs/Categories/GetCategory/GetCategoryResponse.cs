using Domain.Entities.Categories;
using Domain.Shared.Enums;

namespace Application.DTOs.Categories.GetCategories;

public class GetCategoryResponse
{
    public GetCategoryResponse(Category category)
    {
        Id = category.Id;
        Prefix = category.Prefix;
        Name = category.Name;
    }

    public Guid Id { get; }
    
    public string Prefix { get; }

    public string Name { get; }
}
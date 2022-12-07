using Application.Common.Models;
using Application.DTOs.Categories;
using Application.DTOs.Categories.GetCategories;

namespace Application.Services.Interfaces;

public interface ICategoryService
{
    Task<Response<CreateCategoryResponse>> CreateCategoryAsync(CreateCategoryRequest requestModel);
    Task<Response<List<GetCategoryResponse>>> GetAllAsync();
}
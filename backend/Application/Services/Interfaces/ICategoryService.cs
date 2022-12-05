using Application.Common.Models;
using Application.DTOs.Categories;
using Application.DTOs.Users.CreateUser;

using Application.Common.Models;
using Application.DTOs.Categories.GetCategories;

namespace Application.Services.Interfaces;

public interface ICategoryService
{
    public Task<Response<CreateCategoryResponse>> CreateCategoryAsync(CreateCategoryRequest requestModel);
    Task<Response<List<GetCategoryResponse>>> GetAllAsync();
}
using Application.Common.Models;
using Application.DTOs.Categories;
using Application.DTOs.Users.CreateUser;

namespace Application.Services.Interfaces;

public interface ICategoryService
{
    public Task<Response<CreateCategoryResponse>> CreateCategoryAsync(CreateCategoryRequest requestModel);
}
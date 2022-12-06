using Application.Common.Models;
using Application.DTOs.Categories.GetCategories;

namespace Application.Services.Interfaces;

public interface ICategoryService
{
    Task<Response<List<GetCategoryResponse>>> GetAllAsync();
}
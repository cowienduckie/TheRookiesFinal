using API.Attributes;
using Application.Common.Models;
using Application.DTOs.Categories.GetCategories;
using Application.Services.Interfaces;
using Domain.Shared.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : BaseController
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [Authorize(UserRole.Admin)]
    [HttpGet("all")]
    public async Task<ActionResult<Response<List<GetCategoryResponse>>>> GetAll()
    {
        try
        {
            var response = await _categoryService.GetAllAsync();

            if (!response.IsSuccess)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}
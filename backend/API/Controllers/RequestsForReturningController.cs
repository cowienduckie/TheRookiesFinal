using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RequestsForReturningController : BaseController
{
    private readonly IRequestForReturningService _requestForReturningService;

    public RequestsForReturningController(IRequestForReturningService requestForReturningService)
    {
        _requestForReturningService = requestForReturningService;
    }
}
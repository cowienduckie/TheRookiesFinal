using Domain.Shared.Constants;
using Microsoft.AspNetCore.Mvc;

namespace BookLibrary.WebApi.Controllers;

public class BaseController : ControllerBase
{
    protected ActionResult HandleException(Exception exception)
    {
        Console.WriteLine(exception);

        return StatusCode(500, ErrorMessages.InternalServerError);
    }
}
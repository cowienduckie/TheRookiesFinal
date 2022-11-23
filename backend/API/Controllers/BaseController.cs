using Application.Common.Models;
using Domain.Shared.Constants;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BaseController : ControllerBase
{
    protected UserInternalModel? CurrentUser => HttpContext.Items[Settings.CurrentUserContextKey] as UserInternalModel;

    protected ActionResult HandleException(Exception exception)
    {
        Console.WriteLine(exception);

        return StatusCode(500, ErrorMessages.InternalServerError);
    }
}
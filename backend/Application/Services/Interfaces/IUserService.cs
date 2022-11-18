using Application.Common.Models;
using Application.DTOs.Users.Authentication;

namespace Application.Services.Interfaces;

public interface IUserService
{
    Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest requestModel);
    Task<UserInternalModel?> GetInternalModelByIdAsync(Guid id);
}
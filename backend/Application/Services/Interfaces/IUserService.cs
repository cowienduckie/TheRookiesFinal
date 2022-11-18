using Application.Common.Models;
using Application.DTOs.Users.Authentication;
using Application.DTOs.Users.GetUser;

namespace Application.Services.Interfaces;

public interface IUserService
{
    Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest requestModel);
    Task<Response<GetUserResponse>> GetByIdAsync(Guid id);
    Task<UserInternalModel?> GetInternalModelByIdAsync(Guid id);
}
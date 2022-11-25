using Application.Common.Models;
using Application.DTOs.Users.Authentication;
using Application.DTOs.Users.ChangePassword;
using Application.DTOs.Users.GetUser;

namespace Application.Services.Interfaces;

public interface IUserService
{
    Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest requestModel);
    Task<UserInternalModel?> GetInternalModelByIdAsync(Guid id);
    Task<Response> ChangePasswordAsync(ChangePasswordRequest requestModel);
    Task<Response<GetUserResponse>> GetByIdAsync(Guid id);
}
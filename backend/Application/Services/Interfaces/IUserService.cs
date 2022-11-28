using Application.Common.Models;
using Application.DTOs.Users.Authentication;
using Application.DTOs.Users.ChangePassword;
using Application.DTOs.Users.EditUser;
using Application.DTOs.Users.GetListUsers;
using Application.DTOs.Users.GetUser;

namespace Application.Services.Interfaces;

public interface IUserService
{
    Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest requestModel);
    Task<UserInternalModel?> GetInternalModelByIdAsync(Guid id);
    Task<Response> ChangePasswordAsync(ChangePasswordRequest requestModel);
    Task<Response<GetUserResponse>> GetAsync(GetUserRequest request);
    Task<Response<GetListUsersResponse>> GetListAsync(GetListUsersRequest request);
    Task<Response<EditUserResponse>> EditUserAsync(EditUserRequest requestModel);
}
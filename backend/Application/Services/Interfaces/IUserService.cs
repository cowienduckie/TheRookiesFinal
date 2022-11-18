using Application.Common.Models;
using Application.DTOs.Users;

namespace Application.Services.Interfaces;

public interface IUserService
{
    Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest requestModel);
}
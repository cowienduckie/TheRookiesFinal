using Application.Common.Models;
using Application.DTOs.Users.Authentication;
using Application.DTOs.Users.GetUser;
using Application.Services.Interfaces;
using Domain.Entities.Users;
using Domain.Shared.Constants;
using Domain.Shared.Helpers;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class UserService : BaseService, IUserService
{

    public UserService(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    public async Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest requestModel)
    {
        var userRepository = UnitOfWork.AsyncRepository<User>();

        var user = await userRepository.GetAsync(u => u.Username == requestModel.Username);

        if (user == null ||
            !HashStringHelper.IsValid(requestModel.Password, user.HashedPassword))
        {
            return new Response<AuthenticationResponse>(false, ErrorMessages.LoginFailed);
        }

        var token = JwtHelper.GenerateJwtToken(user);
        var authenticationResponse = new AuthenticationResponse(user, token);

        return new Response<AuthenticationResponse>(true, authenticationResponse);
    }

    public async Task<Response<GetUserResponse>> GetByIdAsync(Guid id)
    {
        var userRepository = UnitOfWork.AsyncRepository<User>();

        var user = await userRepository.GetAsync(u => u.Id == id);

        if (user == null)
        {
            return new Response<GetUserResponse>(false);
        }

        var getUserResponse = new GetUserResponse(user);

        return new Response<GetUserResponse>(true, getUserResponse);
    }

    public async Task<UserInternalModel?> GetInternalModelByIdAsync(Guid id)
    {
        var userRepository = UnitOfWork.AsyncRepository<User>();

        var user = await userRepository.GetAsync(u => u.Id == id);

        if (user == null)
        {
            return null;
        }

        return new UserInternalModel(user);
    }
}
using Application.Common.Models;
using Application.DTOs.Users;
using Application.DTOs.Users.Authentication;
using Application.DTOs.Users.ChangePassword;
using Application.DTOs.Users.GetListUsers;
using Application.DTOs.Users.GetUser;
using Application.Services.Interfaces;
using Domain.Entities.Users;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
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

        var user = await userRepository.GetAsync(u => !u.IsDeleted && u.Username == requestModel.Username);

        if (user == null ||
            !HashStringHelper.IsValid(requestModel.Password, user.HashedPassword))
        {
            return new Response<AuthenticationResponse>(false, ErrorMessages.LoginFailed);
        }

        var token = JwtHelper.GenerateJwtToken(user);
        var authenticationResponse = new AuthenticationResponse(user, token);

        return new Response<AuthenticationResponse>(true, authenticationResponse);
    }

    public async Task<Response> ChangePasswordAsync(ChangePasswordRequest requestModel)
    {
        if (requestModel.Id == null)
        {
            return new Response(false, ErrorMessages.BadRequest);
        }

        var userRepository = UnitOfWork.AsyncRepository<User>();

        var user = await userRepository.GetAsync(u => !u.IsDeleted && u.Id == requestModel.Id);

        if (user == null)
        {
            return new Response(false, ErrorMessages.BadRequest);
        }

        if (!user.IsFirstTimeLogIn &&
            !HashStringHelper.IsValid(requestModel.OldPassword, user.HashedPassword))
        {
            return new Response(false, ErrorMessages.WrongOldPassword);
        }

        if (HashStringHelper.IsValid(requestModel.NewPassword, user.HashedPassword))
        {
            return new Response(false, ErrorMessages.MatchingOldAndNewPassword);
        }

        user.HashedPassword = HashStringHelper.HashString(requestModel.NewPassword);

        if (user.IsFirstTimeLogIn)
        {
            user.IsFirstTimeLogIn = false;
        }

        await userRepository.UpdateAsync(user);
        await UnitOfWork.SaveChangesAsync();

        return new Response(true, "Success");
    }

    public async Task<UserInternalModel?> GetInternalModelByIdAsync(Guid id)
    {
        var userRepository = UnitOfWork.AsyncRepository<User>();

        var user = await userRepository.GetAsync(u => !u.IsDeleted && u.Id == id);

        if (user == null)
        {
            return null;
        }

        return new UserInternalModel(user);
    }

    public async Task<Response<GetUserResponse>> GetAsync(GetUserRequest request)
    {
        var userRepository = UnitOfWork.AsyncRepository<User>();

        var user = await userRepository.GetAsync(u => !u.IsDeleted &&
                                                        u.Location == request.Location &&
                                                        u.Id == request.Id);

        if (user == null)
        {
            return new Response<GetUserResponse>(false, ErrorMessages.NotFound);
        }

        var getUserDto = new GetUserResponse(user);

        return new Response<GetUserResponse>(true, getUserDto);
    }

    public async Task<Response<GetListUsersResponse>> GetListAsync(GetListUsersRequest request)
    {
        var userRepository = UnitOfWork.AsyncRepository<User>();

        var users = await userRepository.ListAsync(u => !u.IsDeleted &&
                                                        u.Location == request.Location);
        
        var validSortFields = new []
        {
            ModelFields.StaffCode,
            ModelFields.FullName,
            ModelFields.Username,
            ModelFields.JoinedDate,
            ModelFields.Role
        };

        var validSearchFields = new []
        {
            ModelFields.FullName,
            ModelFields.StaffCode
        };
        
        var response = new GetListUsersResponse();

        return new Response<GetListUsersResponse>(true, response);
    }
}
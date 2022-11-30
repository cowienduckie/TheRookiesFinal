using Application.Common.Models;
using Application.DTOs.Users.Authentication;
using Application.DTOs.Users.ChangePassword;
using Application.DTOs.Users.GetListUsers;
using Application.DTOs.Users.GetUser;
using Application.DTOs.Users.EditUser;
using Application.Helpers;
using Application.DTOs.Users.CreateUser;
using Application.Services.Interfaces;
using Domain.Entities.Users;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Domain.Shared.Helpers;
using Infrastructure.Persistence.Interfaces;
using System.Text.RegularExpressions;

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

    public async Task<Response<CreateUserResponse>> CreateUserAsync(CreateUserRequest requestModel)
    {
        var userRepository = UnitOfWork.AsyncRepository<User>();

        var user = new User();

        var responseModel = new CreateUserResponse(user);
        var userAge = GetAge(requestModel.DateOfBirth);

        if (userAge < Settings.MinimumStaffAge)
        {
            return new Response<CreateUserResponse>(false, ErrorMessages.InvalidAge, responseModel);
        }

        bool isJoinedDateAfterDob = DateTime.Compare(requestModel.JoinedDate, requestModel.DateOfBirth) > 0;

        if (!isJoinedDateAfterDob ||
            requestModel.JoinedDate.DayOfWeek == DayOfWeek.Saturday ||
            requestModel.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
        {
            return new Response<CreateUserResponse>(false, ErrorMessages.InvalidJoinedDate, responseModel);
        } 

        var latestStaffCode = userRepository
                                .ListAsync(u => !u.IsDeleted)
                                .Result
                                .OrderByDescending(u => u.StaffCode)
                                .First()
                                .StaffCode;

        var sameUserNameCount = userRepository
                                    .ListAsync(u => !u.IsDeleted)
                                    .Result
                                    .Count(u => CheckValidUserName(requestModel.FirstName,
                                                                    requestModel.LastName,
                                                                    u.Username));

        var newStaffCode = GetNewStaffCode(latestStaffCode);

        var newUserName = GetNewUserNameWithoutNumber(requestModel.FirstName, requestModel.LastName)
                            + ((sameUserNameCount == 0)
                                ? string.Empty
                                : sameUserNameCount.ToString());

        var newPassword = HashStringHelper.HashString(GetNewPassword(newUserName, requestModel.DateOfBirth));

        user = new User
        {
            Id = Guid.NewGuid(),
            StaffCode = newStaffCode,
            FirstName = requestModel.FirstName,
            LastName = requestModel.LastName,
            Username = newUserName,
            HashedPassword = newPassword,
            DateOfBirth = requestModel.DateOfBirth,
            Gender = requestModel.Gender,
            JoinedDate = requestModel.JoinedDate,
            Role = requestModel.Role,
            Location = requestModel.Location,
            IsFirstTimeLogIn = true,
        };

        responseModel = new CreateUserResponse(user);

        await userRepository.AddAsync(user);
        await UnitOfWork.SaveChangesAsync();

        return new Response<CreateUserResponse>(true, "Success", responseModel);
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

        var users = (await userRepository.ListAsync(u => !u.IsDeleted &&
                                                            u.Location == request.Location))
                                .Select(u => new GetUserResponse(u))
                                .AsQueryable();

        var validSortFields = new []
        {
            ModelField.StaffCode,
            ModelField.FullName,
            ModelField.Username,
            ModelField.JoinedDate,
            ModelField.Role
        };

        var validFilterFields = new []
        {
            ModelField.Role
        };

        var searchFields = new []
        {
            ModelField.FullName,
            ModelField.StaffCode
        };

        var processedList = users.FilterByField(validFilterFields,
                                                request.FilterQuery.FilterField,
                                                request.FilterQuery.FilterValue)
                                    .SearchByField(searchFields,
                                                request.SearchQuery.SearchValue)
                                    .SortByField(validSortFields,
                                                request.SortQuery.SortField,
                                                request.SortQuery.SortDirection);

        var paginatedList = new PagedList<GetUserResponse>(processedList,
                                                            request.PagingQuery.PageIndex,
                                                            request.PagingQuery.PageSize);

        var response = new GetListUsersResponse(paginatedList);

        return new Response<GetListUsersResponse>(true, response);
    }

    public async Task<Response<EditUserResponse>> EditUserAsync(EditUserRequest requestModel)
    {
        var userRepository = UnitOfWork.AsyncRepository<User>();

        var user = await userRepository.GetAsync(user => user.Id == requestModel.Id);

        if (user == null)
        {
            return new Response<EditUserResponse>(false, ErrorMessages.BadRequest);
        }

        if (user.Location != requestModel.AdminLocation)
        {
            return new Response<EditUserResponse>(false, ErrorMessages.InvalidLocation);
        }

        if (GetAge(requestModel.DateOfBirth) < 18)
        {
            return new Response<EditUserResponse>(false, ErrorMessages.InvalidAge);
        }

        if (DateTime.Compare(requestModel.DateOfBirth, requestModel.JoinedDate) > 0
            || requestModel.JoinedDate.DayOfWeek == DayOfWeek.Saturday || requestModel.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
        {
            return new Response<EditUserResponse>(false, ErrorMessages.InvalidJoinedDate);
        }

        user.DateOfBirth = requestModel.DateOfBirth;
        user.Gender = requestModel.Gender;
        user.JoinedDate = requestModel.JoinedDate;
        user.Role = requestModel.Role;

        await userRepository.UpdateAsync(user);

        await UnitOfWork.SaveChangesAsync();

        return new Response<EditUserResponse>(true, "Success");
    }

    private int GetAge(DateTime dateOfBirth)
    {
        var today = DateTime.Now;

        var age = today.Year - dateOfBirth.Year;

        if (today.Month < dateOfBirth.Month || (today.Month == dateOfBirth.Month && today.Day < dateOfBirth.Day)) { age--; }

        return age;
    }
}
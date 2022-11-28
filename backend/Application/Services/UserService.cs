using Application.Common.Models;
using Application.DTOs.Users;
using Application.DTOs.Users.Authentication;
using Application.DTOs.Users.ChangePassword;
using Application.DTOs.Users.GetListUsers;
using Application.DTOs.Users.GetUser;
using Application.Helpers;
using Application.DTOs.Users.CreateUser;
using Application.Services.Interfaces;
using Domain.Entities.Users;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Domain.Shared.Helpers;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.RegularExpressions;

namespace Application.Services;

public class UserService : BaseService, IUserService
{
    private readonly EfContext? _context;

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

        var adminCreator = await userRepository.GetAsync(admin => admin.Id == requestModel.AdminId);

        if (adminCreator != null)
        {
            var user = new User();

            var responseModel = new CreateUserResponse(user);

            if (GetAge(requestModel.DateOfBirth) < 18)
            {
                return new Response<CreateUserResponse>(false, ErrorMessages.InvalidAge, responseModel);
            }

            if (DateTime.Compare(requestModel.DateOfBirth, requestModel.JoinedDate) != 1
                || requestModel.JoinedDate.DayOfWeek == DayOfWeek.Saturday || requestModel.JoinedDate.DayOfWeek == DayOfWeek.Sunday)
            {
                return new Response<CreateUserResponse>(false, ErrorMessages.InvalidJoinedDate, responseModel);
            }

            var latestStaffCode = _context?.Users.OrderByDescending(user => user.StaffCode).First().StaffCode;

            if (latestStaffCode == null)
            {
                return new Response<CreateUserResponse>(false, ErrorMessages.InternalServerError, responseModel);
            }

            var latestUserName = _context?.Users.OrderByDescending(user => user.Username).First().StaffCode;

            if (latestUserName == null)
            {
                return new Response<CreateUserResponse>(false, ErrorMessages.InternalServerError, responseModel);
            }

            var newStaffCode = GetNewStaffCode(latestStaffCode);
            var newUserName = GetNewUserName(requestModel.FirstName, requestModel.LastName, latestUserName);
            var newPassword = HashStringHelper.HashString(GetNewPassword(requestModel.FirstName, requestModel.LastName, requestModel.DateOfBirth));

            user = new User
            {
                StaffCode = newStaffCode,
                FirstName = requestModel.FirstName,
                LastName = requestModel.LastName,
                Username = newUserName,
                HashedPassword = newPassword,
                DateOfBirth = requestModel.DateOfBirth,
                Gender = requestModel.Gender,
                JoinedDate = requestModel.JoinedDate,
                Role = requestModel.Role,
                Location = adminCreator.Location,
                IsFirstTimeLogIn = true,
            };
            responseModel = new CreateUserResponse(user);

            await userRepository.AddAsync(user);
            await UnitOfWork.SaveChangesAsync();

            return new Response<CreateUserResponse>(true, "Success", responseModel);
        }
        else if (adminCreator?.Role != UserRoles.Admin)
        {
            return new Response<CreateUserResponse>(false, ErrorMessages.Unauthorized, new CreateUserResponse(new User()));
        }
        return new Response<CreateUserResponse>(false, ErrorMessages.BadRequest, new CreateUserResponse(new User()));
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
            ModelFields.StaffCode,
            ModelFields.FullName,
            ModelFields.Username,
            ModelFields.JoinedDate,
            ModelFields.Role
        };

        var validFilterFields = new[]
        {
            ModelFields.Role
        };

        var searchFields = new []
        {
            ModelFields.FullName,
            ModelFields.StaffCode
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

    public static int GetAge(DateTime birthDate)
    {
        var today = DateTime.Now;

        var age = today.Year - birthDate.Year;

        if (today.Month < birthDate.Month || (today.Month == birthDate.Month && today.Day < birthDate.Day)) { age--; }

        return age;
    }

    public static string GetNewStaffCode(string previousStaffCode)
    {
        var prefix = "SD";

        var number = Regex.Match(previousStaffCode, @"\d+").Value;

        var nextStaffCodeNumber = Convert.ToInt32(number) + 1;

        return prefix + nextStaffCodeNumber.ToString().PadLeft(4, '0');
    }

    public static string GetNewUserName(string firstName, string lastName, string previousUserName)
    {
        var previousNumber = Regex.Match(previousUserName, @"\d+").Value;

        var number = (previousNumber == "") ? 1 : Convert.ToInt32(previousNumber) + 1;

        var firstNames = firstName.Split("[ ]+");

        var userName = lastName;

        foreach (var name in firstNames)
        {
            userName += name.Substring(1);
        }

        return userName + number.ToString();
    }

    public static string GetNewPassword(string firstName, string lastName, DateTime dateOfBirth)
    {
        var firstNames = firstName.Split("[ ]+");

        var userName = lastName;

        foreach (var name in firstNames)
        {
            userName += name[1..];
        }

        return userName + "@" + dateOfBirth.ToString("ddMMyyyy");
    }
}
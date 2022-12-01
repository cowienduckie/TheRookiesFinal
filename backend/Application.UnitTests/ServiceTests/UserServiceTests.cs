using Application.Services;
using Infrastructure.Persistence.Interfaces;
using Moq;
using System.Linq.Expressions;
using Application.Common.Models;
using Domain.Entities.Users;
using Domain.Interfaces;
using Application.DTOs.Users.Authentication;
using Domain.Shared.Constants;
using Domain.Shared.Helpers;
using Application.DTOs.Users.ChangePassword;
using Application.UnitTests.Common;
using Application.DTOs.Users.DisableUser;
using Domain.Entities.Assignments;
using Application.DTOs.Users.CreateUser;
using Application.Helpers;
using Application.DTOs.Users.EditUser;
using Domain.Shared.Enums;
using Microsoft.IdentityModel.Tokens;

namespace Application.UnitTests.ServiceTests;

public class UserServiceTests
{
    private static readonly Guid UserId = new();
    private Mock<IAsyncRepository<User>> _userRepository = null!;
    private Mock<IUnitOfWork> _unitOfWork = null!;
    private Mock<UserNameHelper> _userNameHelper = null!;
    private UserService _userService = null!;

    [SetUp]
    public void SetUp()
    {
        _userRepository = new Mock<IAsyncRepository<User>>();
        _unitOfWork = new Mock<IUnitOfWork>();

        _unitOfWork
            .Setup(uow => uow.AsyncRepository<User>())
            .Returns(_userRepository.Object);

        _userService = new UserService(_unitOfWork.Object);
    }

    [Test]
    public async Task GetInternalModelByIdAsync_InvalidId_ReturnsNull()
    {
        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as User);

        var result = await _userService.GetInternalModelByIdAsync(It.IsAny<Guid>());

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetInternalModelByIdAsync_InvalidId_ReturnsUserInternalModel()
    {
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = Constants.Password,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var result = await _userService.GetInternalModelByIdAsync(It.IsAny<Guid>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<UserInternalModel>());

            Assert.That(result?.Id, Is.EqualTo(UserId));

            Assert.That(result?.Role, Is.EqualTo(Constants.Role));
        });
    }

    [Test]
    public async Task AuthenticateAsync_WrongUsername_ReturnsNotSuccessResponse()
    {
        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as User);

        var result = await _userService.AuthenticateAsync(It.IsAny<AuthenticationRequest>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<AuthenticationResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.LoginFailed));

            Assert.That(result.Data, Is.Null);
        });
    }

    [Test]
    public async Task AuthenticateAsync_WrongPassword_ReturnsNotSuccessResponse()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password + "DIFFERENT");
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new AuthenticationRequest
        {
            Username = Constants.Username,
            Password = Constants.Password
        };

        var result = await _userService.AuthenticateAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<AuthenticationResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.LoginFailed));

            Assert.That(result.Data, Is.Null);
        });
    }

    [Test]
    public async Task AuthenticateAsync_ValidInput_ReturnsSuccessResponseWithData()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            Role = Constants.Role,
            IsFirstTimeLogIn = false
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new AuthenticationRequest
        {
            Username = Constants.Username,
            Password = Constants.Password
        };

        var result = await _userService.AuthenticateAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<AuthenticationResponse>>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.Null);

            Assert.That(result.Data, Is.Not.Null);

            Assert.That(result.Data, Is.InstanceOf<AuthenticationResponse>());

            Assert.That(result.Data?.Id, Is.EqualTo(UserId));

            Assert.That(result.Data?.Username, Is.EqualTo(Constants.Username));

            Assert.That(result.Data?.Role, Is.EqualTo(Constants.Role.ToString()));

            Assert.That(result.Data?.IsFirstTimeLogin, Is.EqualTo(user.IsFirstTimeLogIn));

            Assert.That(result.Data?.Token, Is.Not.Null.And.Not.Empty);

            var userIdFromToken = JwtHelper.ValidateJwtToken(result.Data?.Token);

            Assert.That(userIdFromToken, Is.Not.Null);

            Assert.That(userIdFromToken, Is.EqualTo(UserId));
        });
    }

    [Test]
    public async Task ChangePasswordAsync_InvalidId_ReturnsNotSuccessResponse()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new ChangePasswordRequest
        {
            OldPassword = Constants.OldPassword,
            NewPassword = Constants.NewPassword + "DIFFERENT"
        };

        var result = await _userService.ChangePasswordAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.BadRequest));
        });
    }

    [Test]
    public async Task ChangePasswordAsync_MatchingOldAndNewPassword_ReturnsNotSuccessResponse()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = false,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new ChangePasswordRequest
        {
            Id = UserId,
            OldPassword = Constants.OldPassword,
            NewPassword = Constants.NewPassword
        };

        var result = await _userService.ChangePasswordAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.MatchingOldAndNewPassword));
        });
    }

    [Test]
    public async Task ChangePasswordAsync_NullUser_ReturnsNotSuccessResponse()
    {
        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as User);

        var request = new ChangePasswordRequest
        {
            OldPassword = Constants.OldPassword,
            NewPassword = Constants.NewPassword + "DIFFERENT"
        };

        var result = await _userService.ChangePasswordAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.BadRequest));

        });
    }

    [Test]
    public async Task ChangePasswordAsync_NotFirstTimeLoginAndInvalidOldPassword_ReturnsNotSuccessResponse()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = false,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new ChangePasswordRequest
        {
            Id = UserId,
            OldPassword = Constants.OldPassword + "DIFFERENT",
            NewPassword = Constants.NewPassword
        };

        var result = await _userService.ChangePasswordAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.WrongOldPassword));
        });
    }

    [Test]
    public async Task ChangePasswordAsync_NotFirstTimeLoginAndValidInputs_ReturnsSuccessResponse()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = false,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new ChangePasswordRequest
        {
            Id = UserId,
            OldPassword = Constants.OldPassword,
            NewPassword = Constants.NewPassword + "DIFFERENT"
        };

        var result = await _userService.ChangePasswordAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(Messages.ActionSuccess));
        });
    }

    [Test]
    public async Task ChangePasswordAsync_FirstTimeLoginAndValidInputs_ReturnsSuccessResponse()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = true,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new ChangePasswordRequest
        {
            Id = UserId,
            OldPassword = Constants.OldPassword,
            NewPassword = Constants.NewPassword + "DIFFERENT"
        };

        var result = await _userService.ChangePasswordAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(Messages.ActionSuccess));
        });
    }

    [Test]
    public async Task IsAbleToDisableUser_ValidAssignmentsExist_ReturnsNotSuccessResponse()
    {
        var assignmentRepository = new Mock<IAsyncRepository<Assignment>>();

        _unitOfWork.Setup(uow => uow.AsyncRepository<Assignment>())
                    .Returns(assignmentRepository.Object);

        assignmentRepository
                        .Setup(ar => ar.ListAsync(
                                                It.IsAny<Expression<Func<Assignment, bool>>>(),
                                                It.IsAny<CancellationToken>()))
                        .ReturnsAsync(new List<Assignment>
                        {
                            It.IsAny<Assignment>()
                        });

        var result = await _userService.IsAbleToDisableUser(It.IsAny<Guid>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.CannotDisableUser));
        });
    }

    [Test]
    public async Task IsAbleToDisableUser_NoValidAssignmentExists_ReturnsSuccessResponse()
    {
        var assignmentRepository = new Mock<IAsyncRepository<Assignment>>();

        _unitOfWork
            .Setup(uow => uow.AsyncRepository<Assignment>())
            .Returns(assignmentRepository.Object);

        assignmentRepository
            .Setup(ar => ar.ListAsync(
                                    It.IsAny<Expression<Func<Assignment, bool>>>(),
                                    It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Assignment>());

        var result = await _userService.IsAbleToDisableUser(It.IsAny<Guid>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.EqualTo(Messages.CanDisableUser));
        });
    }

    [Test]
    public async Task DisableUserAsync_NotFoundUser_ReturnsNotSuccessResponse()
    {
        _userRepository
                    .Setup(ur => ur.GetAsync(
                                            It.IsAny<Expression<Func<User, bool>>>(),
                                            It.IsAny<CancellationToken>()))
                    .ReturnsAsync(null as User);

        var result = await _userService.DisableUserAsync(It.IsAny<DisableUserRequest>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.NotFound));
        });
    }

    [Test]
    public async Task DisableUserAsync_ValidAssignmentsExist_ReturnsNotSuccessResponse()
    {
        var assignmentRepository = new Mock<IAsyncRepository<Assignment>>();

        _unitOfWork
                .Setup(uow => uow.AsyncRepository<Assignment>())
                .Returns(assignmentRepository.Object);

        assignmentRepository
                        .Setup(ar => ar.ListAsync(
                                                It.IsAny<Expression<Func<Assignment, bool>>>(),
                                                It.IsAny<CancellationToken>()))
                        .ReturnsAsync(new List<Assignment>
                        {
                            It.IsAny<Assignment>()
                        });

        _userRepository
                    .Setup(ur => ur.GetAsync(
                                            It.IsAny<Expression<Func<User, bool>>>(),
                                            It.IsAny<CancellationToken>()))
                    .ReturnsAsync(new User());

        var result = await _userService.DisableUserAsync(new DisableUserRequest());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.CannotDisableUser));
        });
    }

    [Test]
    public async Task DisableUserAsync_UserCanDisable_ReturnsSuccessResponse()
    {
        var assignmentRepository = new Mock<IAsyncRepository<Assignment>>();

        _unitOfWork
                .Setup(uow => uow.AsyncRepository<Assignment>())
                .Returns(assignmentRepository.Object);

        assignmentRepository
                        .Setup(ar => ar.ListAsync(
                                                It.IsAny<Expression<Func<Assignment, bool>>>(),
                                                It.IsAny<CancellationToken>()))
                        .ReturnsAsync(new List<Assignment>());

        _userRepository
                    .Setup(ur => ur.GetAsync(
                                            It.IsAny<Expression<Func<User, bool>>>(),
                                            It.IsAny<CancellationToken>()))
                    .ReturnsAsync(new User());

        var result = await _userService.DisableUserAsync(new DisableUserRequest());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.EqualTo(Messages.ActionSuccess));
        });
    }

    [Test]
    public async Task CreateUserAsync_NullUser_ReturnsBadRequest()
    {
        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as User);

        var result = await _userService.CreateUserAsync(null);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<CreateUserResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.BadRequest));
        });
    
    [Test]
    public async Task EditUserAsync_NullUser_ReturnsNotFound()
    {
        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as User);

        var request = new EditUserRequest
        {
            Id = UserId,
            DateOfBirth = new DateTime(2002,5,19),
            Gender = Gender.Female,
            JoinedDate = new DateTime(2022, 12, 2),
            Role = UserRole.Admin,
        };

        var result = await _userService.EditUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.NotFound));
        });
    }

    [Test]
    public async Task EditUserAsync_UserAgeLessThan18_ReturnsInvalidAge()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = true,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new EditUserRequest
        {
            Id = UserId,
            DateOfBirth = new DateTime(2022, 5, 19),
            Gender = Gender.Female,
            JoinedDate = DateTime.Now,
            Role = UserRole.Admin,
        };

        var result = await _userService.EditUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidAge));
        });
    }

    [Test]
    public async Task EditUserAsync_InvalidJoinDate_ReturnsInvalidJoinedDate()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = true,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new EditUserRequest
        {
            Id = UserId,
            DateOfBirth = new DateTime(2002, 5, 19),
            Gender = Gender.Female,
            JoinedDate = new DateTime(2001, 5, 18),
            Role = UserRole.Admin,
        };

        var result = await _userService.EditUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidJoinedDate));
        });
    }

    [Test]
    public async Task EditUserAsync_InvalidJoinDateNotWeekend_ReturnsInvalidJoinedDate()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = true,
            Role = Constants.Role
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new EditUserRequest
        {
            Id = UserId,
            DateOfBirth = new DateTime(2002, 5, 19),
            Gender = Gender.Female,
            JoinedDate = new DateTime(2022, 12, 3),
            Role = UserRole.Admin,
        };

        var result = await _userService.EditUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidJoinedDate));
        });
    }

    [Test]
    public async Task EditUserAsync_InvalidLocation_ReturnsInvalidLocation()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = true,
            Role = Constants.Role,
            Location = Location.HaNoi
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new EditUserRequest
        {
            Id = UserId,
            DateOfBirth = new DateTime(2002, 5, 19),
            Gender = Gender.Female,
            JoinedDate = new DateTime(2022, 12, 1),
            Role = UserRole.Admin,
            AdminLocation = Location.HCMCity
        };

        var result = await _userService.EditUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidLocation));
        });
    }

    [Test]
    public async Task EditUserAsync_ValidInput_ReturnsSuccessResponse()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            IsFirstTimeLogIn = true,
            Role = Constants.Role,
            Location = Location.HaNoi
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new EditUserRequest
        {
            Id = UserId,
            DateOfBirth = new DateTime(2002, 5, 19),
            Gender = Gender.Female,
            JoinedDate = new DateTime(2022, 12, 1),
            Role = UserRole.Admin,
            AdminLocation = Location.HaNoi
        };

        var result = await _userService.EditUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo("Success"));
        });
    }
}


    [Test]
    public async Task CreateUserAsync_InvalidJoinedDateWeekend_ReturnsInvalidJoinedDate()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            StaffCode = Constants.StaffCode,
            FirstName = Constants.FirstName,
            LastName = Constants.LastName,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            DateOfBirth = new DateTime(2002, 10, 5),
            Gender = Constants.NewGender,
            JoinedDate = new DateTime(2022, 12, 3),
            Role = Constants.Role,
            Location = Constants.NewLocation,
            IsFirstTimeLogIn = true,
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new CreateUserRequest
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            JoinedDate = user.JoinedDate,
            Role = user.Role,
            Location = user.Location
        };

        var result = await _userService.CreateUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<CreateUserResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidJoinedDate));
        });
    }

    [Test]
    public async Task CreateUserAsync_InvalidJoinedDateNotWeekend_ReturnsInvalidJoinedDate()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            StaffCode = Constants.StaffCode,
            FirstName = Constants.FirstName,
            LastName = Constants.LastName,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            DateOfBirth = new DateTime(2002, 10, 5),
            Gender = Constants.NewGender,
            JoinedDate = new DateTime(2000, 12, 3),
            Role = Constants.Role,
            Location = Constants.NewLocation,
            IsFirstTimeLogIn = true,
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new CreateUserRequest
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            JoinedDate = user.JoinedDate,
            Role = user.Role,
            Location = user.Location
        };

        var result = await _userService.CreateUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<CreateUserResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidJoinedDate));
        });
    }

    [Test]
    public async Task CreateUserAsync_InvalidDateOfBirth_ReturnsInvalidAge()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.Password);
        var user = new User
        {
            Id = UserId,
            StaffCode = Constants.StaffCode,
            FirstName = Constants.FirstName,
            LastName = Constants.LastName,
            Username = Constants.Username,
            HashedPassword = hashedPassword,
            DateOfBirth = new DateTime(2022, 10, 5),
            Gender = Constants.NewGender,
            JoinedDate = DateTime.Now,
            Role = Constants.Role,
            Location = Constants.NewLocation,
            IsFirstTimeLogIn = true,
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new CreateUserRequest
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            JoinedDate = user.JoinedDate,
            Role = user.Role,
            Location = user.Location
        };

        var result = await _userService.CreateUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<CreateUserResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidAge));
        });
    }

    [Test]
    public async Task CreateUserAsync_ValidInputs_ReturnsSuccessResponse()
    {
        var hashedPassword = HashStringHelper.HashString(Constants.NewCreatePassword);
        var user = new User
        {
            Id = UserId,
            StaffCode = Constants.StaffCode,
            FirstName = Constants.FirstName,
            LastName = Constants.LastName,
            Username = Constants.NewUserName,
            HashedPassword = hashedPassword,
            DateOfBirth = new DateTime(2002, 10, 5),
            Gender = Constants.NewGender,
            JoinedDate = new DateTime(2022, 12, 1),
            Role = Constants.Role,
            Location = Constants.NewLocation,
            IsFirstTimeLogIn = true,
        };

        var request = new CreateUserRequest
        {
            FirstName = Constants.FirstName,
            LastName = Constants.LastName,
            DateOfBirth = new DateTime(2002, 10, 5),
            Gender = Constants.NewGender,
            JoinedDate = new DateTime(2022, 12, 1),
            Role = Constants.Role,
            Location = Constants.NewLocation
        };

        var listUser = new List<User>();
        listUser.Add(new User
        {
            Id = Guid.NewGuid(),
            StaffCode = "SD0001",
            FirstName = "John",
            LastName = "Major",
            Username = "majorj",
            HashedPassword = hashedPassword,
            DateOfBirth = new DateTime(2002, 10, 5),
            Gender = Constants.NewGender,
            JoinedDate = new DateTime(2022, 12, 1),
            Role = Constants.Role,
            Location = Constants.NewLocation,
            IsFirstTimeLogIn = true,
        });
        listUser.Add(new User
        {
            Id = Guid.NewGuid(),
            StaffCode = "SD0002",
            FirstName = "Theresa",
            LastName = "May",
            Username = "mayt",
            HashedPassword = hashedPassword,
            DateOfBirth = new DateTime(2002, 10, 5),
            Gender = Constants.NewGender,
            JoinedDate = new DateTime(2022, 12, 1),
            Role = Constants.Role,
            Location = Constants.NewLocation,
            IsFirstTimeLogIn = true,
        });

        _userRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _userRepository
            .Setup(ur => ur.ListAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(listUser);

        var result = await _userService.CreateUserAsync(request);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<CreateUserResponse>>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo("Success"));

            Assert.That(result.Data, Is.Not.Null);

            Assert.That(result.Data, Is.InstanceOf<CreateUserResponse>());

            Assert.That(result.Data?.FirstName, Is.EqualTo(Constants.FirstName));

            Assert.That(result.Data?.LastName, Is.EqualTo(Constants.LastName));

            Assert.That(result.Data?.StaffCode, Is.EqualTo("SD0003"));
        });
    }
}
using Application.Services;
using Infrastructure.Persistence.Interfaces;
using Moq;
using System.Linq.Expressions;
using Application.Common.Models;
using Domain.Entities.Users;
using Domain.Interfaces;
using Domain.Shared.Enums;
using Application.DTOs.Users.Authentication;
using Domain.Shared.Constants;
using Domain.Shared.Helpers;

namespace Application.UnitTests.ServiceTests;

public class UserServiceTests
{
    private const string USERNAME = "Username";
    private const string PASSWORD = "Password";
    private const UserRoles ROLE = UserRoles.Admin;

    private static readonly Guid UserId = new();

    private Mock<IAsyncRepository<User>> _userRepository = null!;
    private Mock<IUnitOfWork> _unitOfWork = null!;
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
            Username = USERNAME,
            HashedPassword = PASSWORD,
            Role = ROLE
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

            Assert.That(result?.Role, Is.EqualTo(ROLE));
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
        var hashedPassword = HashStringHelper.HashString(PASSWORD + "DIFFERENT");
        var user = new User
        {
            Id = UserId,
            Username = USERNAME,
            HashedPassword = hashedPassword,
            Role = ROLE
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                It.IsAny<Expression<Func<User, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new AuthenticationRequest
        {
            Username = USERNAME,
            Password = PASSWORD
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
        var hashedPassword = HashStringHelper.HashString(PASSWORD);
        var user = new User
        {
            Id = UserId,
            Username = USERNAME,
            HashedPassword = hashedPassword,
            Role = ROLE,
            IsFirstTimeLogIn = false
        };

        _userRepository
            .Setup(ur => ur.GetAsync(
                It.IsAny<Expression<Func<User, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new AuthenticationRequest
        {
            Username = USERNAME,
            Password = PASSWORD
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

            Assert.That(result.Data?.Username, Is.EqualTo(USERNAME));

            Assert.That(result.Data?.Role, Is.EqualTo(ROLE.ToString()));

            Assert.That(result.Data?.IsFirstTimeLogin, Is.EqualTo(user.IsFirstTimeLogIn));

            Assert.That(result.Data?.Token, Is.Not.Null.And.Not.Empty);

            var userIdFromToken = JwtHelper.ValidateJwtToken(result.Data?.Token);

            Assert.That(userIdFromToken, Is.Not.Null);

            Assert.That(userIdFromToken, Is.EqualTo(UserId));
        });
    }
}
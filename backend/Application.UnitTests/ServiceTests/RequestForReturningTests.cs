using Application.Common.Models;
using Application.DTOs.RequestsForReturning.ApproveRequestForReturning;
using Application.DTOs.RequestsForReturning.CreateRequestForReturning;
using Application.DTOs.RequestsForReturning.GetRequestForReturning;
using Application.DTOs.Users.CreateUser;
using Application.Services;
using Application.Services.Interfaces;
using Application.UnitTests.Common;
using Domain.Entities.Assignments;
using Domain.Entities.Categories;
using Domain.Entities.RequestsForReturning;
using Domain.Entities.Users;
using Domain.Interfaces;
using Domain.Shared.Constants;
using Infrastructure.Persistence.Interfaces;
using Infrastructure.Persistence.Repositories;
using Moq;
using System.Linq.Expressions;

namespace Application.UnitTests.ServiceTests;

public class RequestForReturningTests
{
    private Mock<IRequestForReturningRepository> _requestForReturningRepository = null!;
    private Mock<IAssignmentRepository> _assignmentRepository = null!;
    private RequestForReturningService _requestForReturningService = null!;
    private Mock<IUnitOfWork> _unitOfWork = null!;

    [SetUp]
    public void SetUp()
    {
        _requestForReturningRepository = new Mock<IRequestForReturningRepository>();
        _assignmentRepository = new Mock<IAssignmentRepository>();
        _unitOfWork = new Mock<IUnitOfWork>();
        _unitOfWork.Setup(unit => unit.AsyncRepository<RequestForReturning>()).Returns(_requestForReturningRepository.Object);

        _requestForReturningService = new RequestForReturningService(_requestForReturningRepository.Object, _assignmentRepository.Object, _unitOfWork.Object);
    }

    [Test]
    public async Task CreateAsync_NullReturnAssignment_ReturnsBadRequest()
    {
        _assignmentRepository
                .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<Assignment, bool>>>(),
                                It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as Assignment);

        var result = await _requestForReturningService.CreateAsync(It.IsAny<CreateRequestForReturningRequest>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetRequestForReturningResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.BadRequest));
        });
    }

    [Test]
    public async Task CreateAsync_ReturnUnacceptedAssignment_ReturnsBadRequest()
    {
        var entity = AssignmentConstants.SampleAssignment;

        _assignmentRepository
                .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<Assignment, bool>>>(),
                                It.IsAny<CancellationToken>()))
                .ReturnsAsync(entity);

        var user = Constants.SampleUser;
        var userRepository = new Mock<IAsyncRepository<User>>();

        userRepository
                .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
                .ReturnsAsync(user);

        _unitOfWork.Setup(unit => unit.AsyncRepository<User>()).Returns(userRepository.Object);

        var requestModel = new CreateRequestForReturningRequest
        {
            AssignmentId = AssignmentConstants.SampleAssignment.Id,
            RequestedBy = Constants.SampleUser.Id
        };

        var result = await _requestForReturningService.CreateAsync(requestModel);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetRequestForReturningResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidStateReturn));
        });
    }

    [Test]
    public async Task CreateAsync_NullRequester_ReturnsBadRequest()
    {
        var user = Constants.SampleUser;
        var userRepository = new Mock<IAsyncRepository<User>>();

        userRepository
                .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<User, bool>>>(),
                                It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as User);

        _unitOfWork.Setup(unit => unit.AsyncRepository<User>()).Returns(userRepository.Object);

        var requestModel = new CreateRequestForReturningRequest
        {
            AssignmentId = AssignmentConstants.SampleAssignment.Id,
            RequestedBy = user.Id,
        };

        var result = await _requestForReturningService.CreateAsync(requestModel);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetRequestForReturningResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.BadRequest));
        });
    }

    [Test]
    public async Task ApproveAsync_NullReturningRequest_ReturnsBadRequest()
    {
        _requestForReturningRepository
                .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<RequestForReturning, bool>>>(),
                                It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as RequestForReturning);

        var requestModel = new ApproveRequestForReturningRequest
        {
            Id = RequestForReturningConstants.AssignmentId,
            IsCompleted = RequestForReturningConstants.IsCompleted,
            Approver = RequestForReturningConstants.Approver
        };

        var result = await _requestForReturningService.ApproveAsync(requestModel);

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
    public async Task ApproveAsync_NotWaiting_ReturnsBadRequest()
    {

        var request = RequestForReturningConstants.SampleCompletedRequestForReturning;

        _requestForReturningRepository
                .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<RequestForReturning, bool>>>(),
                                It.IsAny<CancellationToken>()))
                .ReturnsAsync(request);

        var requestModel = new ApproveRequestForReturningRequest
        {
            Id = RequestForReturningConstants.AssignmentId,
            IsCompleted = RequestForReturningConstants.IsCompleted,
            Approver = RequestForReturningConstants.Approver
        };

        var result = await _requestForReturningService.ApproveAsync(requestModel);

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
    public async Task ApproveAsync_ValidInputs_ReturnsActionSuccess()
    {
        var request = RequestForReturningConstants.SampleRequestForReturning;

        _requestForReturningRepository
                .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<RequestForReturning, bool>>>(),
                                It.IsAny<CancellationToken>()))
                .ReturnsAsync(request);

        var requestModel = new ApproveRequestForReturningRequest
        {
            Id = RequestForReturningConstants.AssignmentId,
            IsCompleted = RequestForReturningConstants.IsCompleted,
            Approver = RequestForReturningConstants.Approver
        };

        var result = await _requestForReturningService.ApproveAsync(requestModel);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(Messages.ActionSuccess));
        });
    }
}

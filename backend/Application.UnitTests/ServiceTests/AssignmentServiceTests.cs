using System.Linq.Expressions;
using Application.Common.Models;
using Application.DTOs.Assignments.DeleteAssignment;
using Application.DTOs.Assignments.GetAssignment;
using Application.DTOs.Assignments.RespondAssignment;
using Application.DTOs.Users.GetUser;
using Application.Services;
using Application.UnitTests.Common;
using Domain.Entities.Assets;
using Domain.Entities.Assignments;
using Domain.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Infrastructure.Persistence.Interfaces;
using Infrastructure.Persistence.Repositories;
using Moq;

namespace Application.UnitTests.ServiceTests;

public class AssignmentServiceTests
{
    private Mock<IAssignmentRepository> _assignmentRepository = null!;
    private AssignmentService _assignmentService = null!;
    private Mock<IUnitOfWork> _unitOfWork = null!;

    [SetUp]
    public void SetUp()
    {
        _assignmentRepository = new Mock<IAssignmentRepository>();
        _unitOfWork = new Mock<IUnitOfWork>();

        _assignmentService = new AssignmentService(_unitOfWork.Object, _assignmentRepository.Object);
    }

    [Test]
    public async Task GetAsync_InvalidInput_ReturnsFalseResult()
    {
        _assignmentRepository
        .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as Assignment);

        var result = await _assignmentService.GetAsync(It.IsAny<GetAssignmentRequest>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssignmentResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.NotFound));

            Assert.That(result.Data, Is.Null);
        });
    }

    [Test]
    public async Task GetAsync_WrongLocation_ReturnsFalseResult()
    {
        var entity = AssignmentConstants.SampleAssignment;

        _assignmentRepository
            .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        const Location differentLocation = Location.HCMCity;

        var input = new GetAssignmentRequest
        {
            Id = It.IsAny<Guid>(),
            Location = differentLocation
        };

        var result = await _assignmentService.GetAsync(input);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssignmentResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.NotFound));

            Assert.That(result.Data, Is.Null);
        });
    }

    [Test]
    public async Task GetAsync_ValidInput_ReturnsTrueResultWithData()
    {
        var entity = AssignmentConstants.SampleAssignment;

        _assignmentRepository
        .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        var input = new GetAssignmentRequest
        {
            Id = It.IsAny<Guid>(),
            Location = Constants.NewLocation
        };

        var result = await _assignmentService.GetAsync(input);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssignmentResponse>>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Data, Is.Not.Null);

            Assert.That(result.Data, Is.InstanceOf<GetAssignmentResponse>());

            Assert.That(result.Data!.Id, Is.EqualTo(AssignmentConstants.Id));

            Assert.That(result.Data!.AssetCode, Is.EqualTo(AssetConstants.AssetCode));

            Assert.That(result.Data!.AssetName, Is.EqualTo(AssetConstants.Name));

            Assert.That(result.Data!.Specification, Is.EqualTo(AssetConstants.Specification));

            Assert.That(result.Data!.AssignedTo, Is.EqualTo(Constants.SampleUser.Username));

            Assert.That(result.Data!.AssignedBy, Is.EqualTo(Constants.SampleUser.Username));

            Assert.That(result.Data!.State, Is.EqualTo(AssignmentConstants.StateString));

            Assert.That(result.Data!.AssignedDate, Is.EqualTo(AssignmentConstants.AssignedDateString));

            Assert.That(result.Data!.Note, Is.Null);
        });
    }

    [Test]
    public async Task RespondAssignmentAsync_NullAssignment_ReturnsNotFound()
    {
        _assignmentRepository
        .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as Assignment);

        var input = new RespondAssignmentRequest
        {
            Id = It.IsAny<Guid>(),
            State = AssignmentState.WaitingForAcceptance,
        };

        var result = await _assignmentService.RespondAssignmentAsync(input);

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
    public async Task RespondAssignmentAsync_ValidAssignment_ReturnsActionSuccess()
    {
        var entity = AssignmentConstants.SampleAssignment;

        _assignmentRepository
        .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        var input = new RespondAssignmentRequest
        {
            Id = AssignmentConstants.Id,
            State = AssignmentState.Accepted,
        };

        var result = await _assignmentService.RespondAssignmentAsync(input);

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
    public async Task RespondAssignmentAsync_StateIsNotWaiting_ReturnsInvalidState()
    {
        var entity = AssignmentConstants.SampleAcceptedAssignment;

        _assignmentRepository
        .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        var input = new RespondAssignmentRequest
        {
            Id = AssignmentConstants.Id,
            State = AssignmentState.Accepted,
        };

        var result = await _assignmentService.RespondAssignmentAsync(input);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.InvalidState));
        });
    }

    [Test]
    public async Task DeleteAssignmentAsync_UnexistedAssignment_ReturnsNotFound()
    {
        _assignmentRepository
        .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(It.IsAny<Assignment>);

        var input = new DeleteAssignmentRequest
        {
            Id = new Guid()
        };

        var result = await _assignmentService.DeleteAssignmentAsync(input);

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
    public async Task DeleteAssignmentAsync_AcceptedAssignment_ReturnsCannotDeleteAssignment()
    {
        var entity = AssignmentConstants.SampleAcceptedAssignment;

        _assignmentRepository
        .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        var input = new DeleteAssignmentRequest
        {
            Id = AssignmentConstants.SampleAcceptedAssignment.Id
        };

        var result = await _assignmentService.DeleteAssignmentAsync(input);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.Not.Null);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.CannotDeleteAssignment));
        });
    }

    [Test]
    public async Task DeleteAssignmentAsync_ValidInput_ReturnsActionSuccess()
    {
        var entity = AssignmentConstants.SampleAssignment;

        _assignmentRepository
        .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Assignment, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        var assetRepository = new Mock<IAsyncRepository<Asset>>();

        assetRepository
            .Setup(ur => ur.GetAsync(
                                It.IsAny<Expression<Func<Asset, bool>>>(),
                                It.IsAny<CancellationToken>()))
        .ReturnsAsync(AssetConstants.SampleAsset1);

        _unitOfWork.Setup(unit => unit.AsyncRepository<Asset>()).Returns(assetRepository.Object);

        var input = new DeleteAssignmentRequest
        {
            Id = AssignmentConstants.SampleAssignment.Id
        };

        var result = await _assignmentService.DeleteAssignmentAsync(input);

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

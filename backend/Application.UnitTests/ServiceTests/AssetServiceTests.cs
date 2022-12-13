using System.Linq.Expressions;
using System.Net.Http.Headers;
using System.Xml.Linq;
using Application.Common.Models;
using Application.DTOs.Assets;
using Application.DTOs.Assets.CreateAsset;
using Application.DTOs.Assets.GetAsset;
using Application.Services;
using Application.UnitTests.Common;
using Domain.Entities.Assets;
using Domain.Entities.Assignments;
using Domain.Entities.Categories;
using Domain.Interfaces;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Infrastructure.Persistence.Interfaces;
using Moq;

namespace Application.UnitTests.ServiceTests;

public class AssetServiceTests
{
    private Mock<IAssetRepository> _assetRepository = null!;
    private Mock<ICategoryRepository> _categoryRepository = null!;
    private AssetService _assetService = null!;
    private Mock<IUnitOfWork> _unitOfWork = null!;

    [SetUp]
    public void SetUp()
    {
        _assetRepository = new Mock<IAssetRepository>();
        _categoryRepository = new Mock<ICategoryRepository>();
        _unitOfWork = new Mock<IUnitOfWork>();
        _unitOfWork.Setup(unit => unit.AsyncRepository<Category>()).Returns(_categoryRepository.Object);

        _assetService = new AssetService(_unitOfWork.Object, _assetRepository.Object);
    }

    [Test]
    public async Task GetAsync_InvalidInput_ReturnsFalseResult()
    {
        _assetRepository
            .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Asset, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as Asset);

        var result = await _assetService.GetAsync(It.IsAny<GetAssetRequest>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssetResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.NotFound));

            Assert.That(result.Data, Is.Null);
        });
    }

    [Test]
    public async Task GetAsync_ValidInput_ReturnsTrueResultWithData()
    {
        var entity = AssetConstants.SampleAsset;

        _assetRepository
            .Setup(ar => ar.GetAsync(
                It.IsAny<Expression<Func<Asset, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        var result = await _assetService.GetAsync(It.IsAny<GetAssetRequest>());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssetResponse>>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.EqualTo(Messages.ActionSuccess));

            Assert.That(result.Data, Is.Not.Null);

            Assert.That(result.Data, Is.InstanceOf<GetAssetResponse>());

            Assert.That(result.Data!.Id, Is.EqualTo(AssetConstants.Id));

            Assert.That(result.Data!.AssetCode, Is.EqualTo(AssetConstants.AssetCode));

            Assert.That(result.Data!.Name, Is.EqualTo(AssetConstants.Name));

            Assert.That(result.Data!.Category, Is.EqualTo(AssetConstants.CategoryName));

            Assert.That(result.Data!.Specification, Is.EqualTo(AssetConstants.Specification));

            Assert.That(result.Data!.InstalledDate, Is.EqualTo(AssetConstants.InstalledDateString));

            Assert.That(result.Data!.State, Is.EqualTo(AssetConstants.StateString));

            Assert.That(result.Data!.Location, Is.EqualTo(AssetConstants.LocationString));
        });
    }

    [Test]
    public async Task CreateAssetAsync_NullCategory_ReturnsUnexistedCategory()
    {
        var listAsset = new List<Asset>
        {
            AssetConstants.SampleAsset1,
            AssetConstants.SampleAsset2
        };

        var newAsset = new CreateAssetRequest
        {
            Name = AssetConstants.Name,
            CategoryId = AssetConstants.CategoryId,
            Specification = AssetConstants.Specification,
            InstalledDate = AssetConstants.InstalledDate,
            State = AssetConstants.State,
            Location = AssetConstants.AssetLocation,
        };

        _assetRepository
            .Setup(ur => ur.ListAsync(
                                It.IsAny<Expression<Func<Asset, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(listAsset);

        _categoryRepository
            .Setup(cat => cat.GetAsync(
                It.IsAny<Expression<Func<Category, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as Category);

        var result = await _assetService.CreateAssetAsync(newAsset);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssetResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.UnexistedCategory));
        });
    }

    [Test]
    public async Task CreateAssetAsync_ValidInput_ReturnsSuccessResponse()
    {
        _categoryRepository
            .Setup(cat => cat.GetAsync(
                It.IsAny<Expression<Func<Category, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(AssetConstants.SampleCategory);

        var listAsset = new List<Asset>
        {
            AssetConstants.SampleAsset1,
            AssetConstants.SampleAsset2
        };

        _assetRepository
            .Setup(ur => ur.ListAsync(
                                It.IsAny<Expression<Func<Asset, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(listAsset);

        var newAsset = new CreateAssetRequest
        {
            Name = AssetConstants.Name,
            CategoryId = AssetConstants.CategoryId,
            Specification = AssetConstants.Specification,
            InstalledDate = AssetConstants.InstalledDate,
            State = AssetConstants.State,
            Location = AssetConstants.AssetLocation,
        };

        var result = await _assetService.CreateAssetAsync(newAsset);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssetResponse>>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.EqualTo(Messages.ActionSuccess));

            Assert.That(result.Data, Is.Not.Null);

            Assert.That(result.Data!.AssetCode, Is.EqualTo("SC000003"));
        });
    }

    [Test]
    public async Task DeleteAssetAsync_InvalidAssetId_ReturnsNotFound()
    {
        var listAsset = new List<Asset>
        {
            AssetConstants.SampleAsset1,
            AssetConstants.SampleAsset2
        };

        _assetRepository
            .Setup(ur => ur.ListAsync(
                                It.IsAny<Expression<Func<Asset, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(listAsset);

        var requestModel = new DeleteAssetRequest
        {
            Id = Guid.NewGuid(),
        };

        var result = await _assetService.DeleteAssetAsync(requestModel);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.NotFound));
        });
    }


    [Test]
    public async Task DeleteAssetAsync_HasHistoricalAssignment_ReturnsNotFound()
    {
        var listAsset = new List<Asset>
        {
            AssetConstants.SampleAsset1,
            AssetConstants.SampleAsset2
        };

        _assetRepository
            .Setup(ar => ar.ListAsync(
                                It.IsAny<Expression<Func<Asset, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Asset>
                        {
                            It.IsAny<Asset>()
                        });

        _assetRepository
            .Setup(ar => ar.GetAsync(
                                It.IsAny<Expression<Func<Asset, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Asset());

        var listAssignment = new List<Assignment>
        {
                AssignmentConstants.SampleAssignment,
                AssignmentConstants.SampleAcceptedAssignment  
        };

        var assignmentRepository = new Mock<IAsyncRepository<Assignment>>();

        assignmentRepository
            .Setup(ur => ur.ListAsync(
                                It.IsAny<Expression<Func<Assignment, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Assignment>
                        {
                            It.IsAny<Assignment>()
                        });

        _unitOfWork.Setup(unit => unit.AsyncRepository<Assignment>()).Returns(assignmentRepository.Object);

        var requestModel = new DeleteAssetRequest
        {
            Id = Guid.NewGuid(),
        };

        var result = await _assetService.DeleteAssetAsync(requestModel);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.CannotDeleteAsset));
        });
    }

    [Test]
    public async Task DeleteAssetAsync_ValidInput_ReturnsSuccessResponse()
    {
        var listAsset = new List<Asset>
        {
            AssetConstants.SampleAsset1,
            AssetConstants.SampleAsset2
        };

        _assetRepository
            .Setup(ur => ur.ListAsync(
                                It.IsAny<Expression<Func<Asset, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(listAsset);

        var listAssignment = new List<Assignment>
        {
                AssignmentConstants.SampleAssignment,
                AssignmentConstants.SampleAssignment2
        };

        var assignmentRepository = new Mock<IAsyncRepository<Assignment>>();

        assignmentRepository
            .Setup(ur => ur.ListAsync(
                                It.IsAny<Expression<Func<Assignment, bool>>>(),
                                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Assignment>
                        {
                            It.IsAny<Assignment>()
                        });

        var requestModel = new DeleteAssetRequest
        {
            Id = new Guid("71990173-999c-45d6-b135-fc8206055154"),
        };

        var result = await _assetService.DeleteAssetAsync(requestModel);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.EqualTo(Messages.ActionSuccess));
        });
    }
}
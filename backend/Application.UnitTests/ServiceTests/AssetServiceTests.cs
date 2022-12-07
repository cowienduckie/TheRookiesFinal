using System.Linq.Expressions;
using System.Net.Http.Headers;
using System.Xml.Linq;
using Application.Common.Models;
using Application.DTOs.Assets.CreateAsset;
using Application.DTOs.Assets.GetAsset;
using Application.Services;
using Application.UnitTests.Common;
using Domain.Entities.Assets;
using Domain.Entities.Categories;
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

            Assert.That(result.Data!.HasHistoricalAssignment, Is.EqualTo(AssetConstants.HasHistoricalAssignment));
        });
    }

    [Test]
    public async Task CreateAsset_ValidInput_ReturnsSuccessResponse()
    {
        var newCategory = new Category
        {
            Id = Guid.NewGuid(),
            Prefix = "LA",
            Name = "Laptop"
        };

        //var asset = new Asset
        //{
        //    Id = Guid.NewGuid(),
        //    AssetCode = "LA000001",
        //    Name = AssetConstants.Name,
        //    CategoryId = newCategory.Id,
        //    Category = newCategory,
        //    Specification = AssetConstants.Specification,
        //    InstalledDate = AssetConstants.InstalledDate,
        //    State = AssetConstants.State,
        //    Location = AssetConstants.AssetLocation,
        //    HasHistoricalAssignment = AssetConstants.HasHistoricalAssignment,
        //};

        _categoryRepository
            .Setup(cat => cat.GetAsync(
                It.IsAny<Expression<Func<Category, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(newCategory);

        var listAsset = new List<Asset>
        {
            new Asset{
                Id = Guid.NewGuid(),
                AssetCode = "LA000001",
                Name = AssetConstants.Name,
                CategoryId = newCategory.Id,
                Specification = AssetConstants.Specification,
                InstalledDate = AssetConstants.InstalledDate,
                State = AssetConstants.State,
                Location = AssetConstants.AssetLocation,
                HasHistoricalAssignment = AssetConstants.HasHistoricalAssignment,
            },
            new Asset{
                Id = Guid.NewGuid(),
                AssetCode = "LA000002",
                Name = AssetConstants.Name + "NEW",
                CategoryId = newCategory.Id,
                Specification = AssetConstants.Specification,
                InstalledDate = AssetConstants.InstalledDate,
                State = AssetConstants.State,
                Location = AssetConstants.AssetLocation,
                HasHistoricalAssignment = AssetConstants.HasHistoricalAssignment,
            }
        };

        var newAsset = new CreateAssetRequest
        {
            Name = AssetConstants.Name,
            CategoryId = newCategory.Id,
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

        var result = await _assetService.CreateAssetAsync(newAsset);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssetResponse>>());

            Assert.That(result.IsSuccess, Is.True);

            Assert.That(result.Message, Is.EqualTo(Messages.ActionSuccess));

            Assert.That(result.Data, Is.Not.Null);

            Assert.That(result.Data!.AssetCode, Is.EqualTo("LA000003"));
        });
    }

    [Test]
    public async Task CreateAsset_NullCategory_ReturnsUnexistedCategory()
    {

        //var asset = new Asset
        //{
        //    Id = Guid.NewGuid(),
        //    AssetCode = "LA000001",
        //    Name = AssetConstants.Name,
        //    CategoryId = newCategory.Id,
        //    Category = newCategory,
        //    Specification = AssetConstants.Specification,
        //    InstalledDate = AssetConstants.InstalledDate,
        //    State = AssetConstants.State,
        //    Location = AssetConstants.AssetLocation,
        //    HasHistoricalAssignment = AssetConstants.HasHistoricalAssignment,
        //};

        _categoryRepository
            .Setup(cat => cat.GetAsync(
                It.IsAny<Expression<Func<Category, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as Category);

        var listAsset = new List<Asset>
        {
            new Asset{
                Id = Guid.NewGuid(),
                AssetCode = "LA000001",
                Name = AssetConstants.Name,
                CategoryId = AssetConstants.CategoryId,
                Specification = AssetConstants.Specification,
                InstalledDate = AssetConstants.InstalledDate,
                State = AssetConstants.State,
                Location = AssetConstants.AssetLocation,
                HasHistoricalAssignment = AssetConstants.HasHistoricalAssignment,
            },
            new Asset{
                Id = Guid.NewGuid(),
                AssetCode = "LA000002",
                Name = AssetConstants.Name + "NEW",
                CategoryId = AssetConstants.CategoryId,
                Specification = AssetConstants.Specification,
                InstalledDate = AssetConstants.InstalledDate,
                State = AssetConstants.State,
                Location = AssetConstants.AssetLocation,
                HasHistoricalAssignment = AssetConstants.HasHistoricalAssignment,
            }
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

        var result = await _assetService.CreateAssetAsync(newAsset);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);

            Assert.That(result, Is.InstanceOf<Response<GetAssetResponse>>());

            Assert.That(result.IsSuccess, Is.False);

            Assert.That(result.Message, Is.EqualTo(ErrorMessages.UnexistedCategory));
        });
    }
}
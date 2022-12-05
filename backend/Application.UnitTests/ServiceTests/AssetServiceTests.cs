using System.Linq.Expressions;
using Application.Common.Models;
using Application.DTOs.Assets.GetAsset;
using Application.Services;
using Application.UnitTests.Common;
using Domain.Entities.Assets;
using Domain.Shared.Constants;
using Infrastructure.Persistence.Interfaces;
using Moq;

namespace Application.UnitTests.ServiceTests;

public class AssetServiceTests
{
    private Mock<IAssetRepository> _assetRepository = null!;
    private AssetService _assetService = null!;
    private Mock<IUnitOfWork> _unitOfWork = null!;

    [SetUp]
    public void SetUp()
    {
        _assetRepository = new Mock<IAssetRepository>();
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
}
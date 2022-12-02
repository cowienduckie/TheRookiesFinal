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
    private Mock<IUnitOfWork> _unitOfWork = null!;
    private AssetService _assetService = null!;

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
        var expected = AssetConstants.ExpectedGetResponse;

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

            Assert.That(result.Data, Is.EqualTo(expected));
        });
    }
}
using Domain.Entities.Assets;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Configurations;

public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.HasOne(a => a.Category)
            .WithMany(a => a.Assets)
            .HasForeignKey(a => a.CategoryId);
    }
}
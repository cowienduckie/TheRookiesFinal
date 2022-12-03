using Domain.Entities.Assignments;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Configurations;

public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.HasOne(a => a.Assignee)
                .WithMany(u => u.OwnedAssignments)
                .HasForeignKey(a => a.AssignedTo)
                .OnDelete(DeleteBehavior.NoAction);
        
        builder.HasOne(a => a.Assigner)
                .WithMany(u => u.CreatedAssignments)
                .HasForeignKey(a => a.AssignedBy)
                .OnDelete(DeleteBehavior.NoAction);
        
        builder.HasOne(a => a.Asset)
            .WithMany(a => a.Assignments)
            .HasForeignKey(a => a.AssetId);
    }
}
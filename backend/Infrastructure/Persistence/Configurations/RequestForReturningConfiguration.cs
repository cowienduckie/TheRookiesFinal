using Domain.Entities.RequestsForReturning;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class RequestForReturningConfiguration : IEntityTypeConfiguration<RequestForReturning>
{
    public void Configure(EntityTypeBuilder<RequestForReturning> builder)
    {
        builder.HasOne(r => r.Assignment)
            .WithMany(a => a.RequestsForReturning)
            .HasForeignKey(r => r.AssignmentId);

        builder.HasOne(r => r.Requester)
            .WithMany(u => u.OwnedRequestsForReturning)
            .HasForeignKey(r => r.RequestedBy);

        builder.HasOne(r => r.Approver)
            .WithMany(u => u.AcceptedRequestsForReturning)
            .HasForeignKey(r => r.AcceptedBy);
    }
}
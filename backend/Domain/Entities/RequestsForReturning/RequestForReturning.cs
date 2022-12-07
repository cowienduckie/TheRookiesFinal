using Domain.Base;
using Domain.Entities.Assignments;
using Domain.Entities.Users;
using Domain.Shared.Enums;

namespace Domain.Entities.RequestsForReturning;

public class RequestForReturning : AuditableEntity<Guid>
{
    public Guid AssignmentId { get; set; }

    public Assignment Assignment { get; set; } = null!;

    public Guid RequestedBy { get; set; }

    public User Requester { get; set; } = null!;

    public Guid? AcceptedBy { get; set; }

    public User? Approver { get; set; }

    public DateTime? ReturnDate { get; set; }

    public RequestForReturningState State { get; set; }
}
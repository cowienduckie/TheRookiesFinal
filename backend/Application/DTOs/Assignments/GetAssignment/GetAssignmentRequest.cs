using Domain.Shared.Enums;

namespace Application.DTOs.Assignments.GetAssignment;

public class GetAssignmentRequest
{
    public Guid Id { get; set; }

    public Location Location { get; set; }
}
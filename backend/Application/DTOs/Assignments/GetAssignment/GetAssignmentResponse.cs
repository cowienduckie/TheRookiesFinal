using Domain.Entities.Assignments;
using Domain.Shared.Helpers;

namespace Application.DTOs.Assignments.GetAssignment;

public class GetAssignmentResponse
{
    public GetAssignmentResponse(Assignment assignment)
    {
        Id = assignment.Id;
        AssetCode = assignment.Asset.AssetCode;
        AssetName = assignment.Asset.Name;
        Specification = assignment.Asset.Specification;
        AssignedTo = assignment.Assignee.Username;
        AssignedBy = assignment.Assigner.Username;
        AssignedDate = assignment.AssignedDate.ToString("dd/MM/yyyy");
        State = assignment.State.GetDescription() ?? assignment.State.ToString();
        Note = assignment.Note;
    }

    public Guid Id { get; }

    public string AssetCode { get; }

    public string AssetName { get; }

    public string Specification { get; }

    public string AssignedTo { get; }

    public string AssignedBy { get; }

    public string AssignedDate { get; }

    public string State { get; }

    public string? Note { get; }
}
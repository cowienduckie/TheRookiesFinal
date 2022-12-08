using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Assignments.CreateAssignment;

public class CreateAssignmentRequest
{
    [Required] public Guid AssetId { get; set; }

    [Required] public Guid AssignedTo { get; set; }

    public Guid AssignedBy { get; set; }

    [Required] public DateTime AssignedDate { get; set; }

    public string? Note { get; set; }
}
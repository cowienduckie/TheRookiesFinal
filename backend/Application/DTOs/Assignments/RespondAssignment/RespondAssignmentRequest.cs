using Domain.Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Assignments.RespondAssignment
{
    public class RespondAssignmentRequest
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public AssignmentState State { get; set; }
    }
}

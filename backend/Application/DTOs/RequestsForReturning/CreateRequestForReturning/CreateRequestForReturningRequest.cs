using Domain.Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.RequestsForReturning.CreateRequestForReturning
{
    public class CreateRequestForReturningRequest
    {
        [Required]
        public Guid AssignmentId { get; set; }

        [Required]
        public Guid RequestedBy { get; set; }
    }
}

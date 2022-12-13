using System.ComponentModel.DataAnnotations;
using Application.Common.Models;

namespace Application.DTOs.RequestsForReturning.ApproveRequestForReturning;

public class ApproveRequestForReturningRequest
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    public bool IsCompleted { get; set; }

    public UserInternalModel Approver { get; set; } = null!;
}
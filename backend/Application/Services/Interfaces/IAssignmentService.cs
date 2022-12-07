using Application.Common.Models;
using Application.DTOs.Assignments.GetAssignment;
using Application.DTOs.Assignments.GetListAssignments;
using Application.DTOs.Assignments.RespondAssignment;

namespace Application.Services.Interfaces;

public interface IAssignmentService
{
    Task<Response<GetAssignmentResponse>> GetAsync(GetAssignmentRequest request);
    Task<Response<GetListAssignmentsResponse>> GetListAsync(GetListAssignmentsRequest request);
    Task<Response<GetListAssignmentsResponse>> GetOwnedListAsync(GetListOwnedAssignmentsRequest request);
    Task<Response> RespondAssignmentAsync(RespondAssignmentRequest request);
}
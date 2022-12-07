using Application.Common.Models;
using Application.DTOs.Assignments.GetAssignment;
using Application.DTOs.Assignments.GetListAssignments;

namespace Application.Services.Interfaces;

public interface IAssignmentService
{
    Task<Response<GetAssignmentResponse>> GetAsync(GetAssignmentRequest request);
    Task<Response<GetListAssignmentsResponse>> GetListAsync(GetListAssignmentsRequest request);
    Task<Response<GetListAssignmentsResponse>> GetOwnedListAsync(GetListOwnedAssignmentsRequest request);
}
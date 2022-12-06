using Application.Common.Models;
using Application.DTOs.Assignments.GetAssignment;

namespace Application.DTOs.Assignments.GetListAssignments;

public class GetListAssignmentsResponse
{
    public GetListAssignmentsResponse(PagedList<GetAssignmentResponse> pagedList)
    {
        Result = pagedList;
    }

    public PagedList<GetAssignmentResponse> Result { get; }
}
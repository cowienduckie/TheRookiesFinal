using Application.Common.Models;
using Application.Queries;

namespace Application.DTOs.Assignments.GetListAssignments;

public class GetListOwnedAssignmentsRequest
{
    public GetListOwnedAssignmentsRequest(
        PagingQuery pagingQuery,
        SortQuery sortQuery,
        UserInternalModel currentUser)
    {
        PagingQuery = pagingQuery;
        SortQuery = sortQuery;
        CurrentUser = currentUser;
    }

    public PagingQuery PagingQuery { get; }

    public SortQuery SortQuery { get; }

    public UserInternalModel CurrentUser { get; }
}
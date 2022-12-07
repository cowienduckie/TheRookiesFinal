using Application.Queries;
using Application.Queries.Assignments;
using Domain.Shared.Enums;

namespace Application.DTOs.Assignments.GetListAssignments;

public class GetListAssignmentsRequest
{
    public GetListAssignmentsRequest(
        PagingQuery pagingQuery,
        SortQuery sortQuery,
        SearchQuery searchQuery,
        AssignmentFilter assignmentFilter,
        Location location)
    {
        PagingQuery = pagingQuery;
        SortQuery = sortQuery;
        SearchQuery = searchQuery;
        AssignmentFilter = assignmentFilter;
        Location = location;
    }

    public PagingQuery PagingQuery { get; }

    public SortQuery SortQuery { get; }

    public SearchQuery SearchQuery { get; }

    public AssignmentFilter AssignmentFilter { get; }

    public Location Location { get; }
}
using Application.Queries;
using Application.Queries.RequestsForReturning;
using Domain.Shared.Enums;

namespace Application.DTOs.RequestsForReturning.GetListRequestsForReturning;

public class GetListRequestsForReturningRequest
{
    public GetListRequestsForReturningRequest(
        PagingQuery pagingQuery,
        SortQuery sortQuery,
        SearchQuery searchQuery,
        RequestForReturningFilter filter,
        Location location
    )
    {
        PagingQuery = pagingQuery;
        SortQuery = sortQuery;
        SearchQuery = searchQuery;
        Filter = filter;
        Location = location;
    }

    public PagingQuery PagingQuery { get; }

    public SortQuery SortQuery { get; }

    public SearchQuery SearchQuery { get; }

    public RequestForReturningFilter Filter { get; }

    public Location Location { get; }
}
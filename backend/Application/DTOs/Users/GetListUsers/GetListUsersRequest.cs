using Application.Queries;
using Domain.Shared.Enums;

namespace Application.DTOs.Users.GetListUsers;

public class GetListUsersRequest
{
    public GetListUsersRequest(
        Locations location,
        PagingQuery pagingQuery,
        SortQuery sortQuery,
        FilterQuery filterQuery,
        SearchQuery searchQuery)
    {
        Location = location;
        PagingQuery = pagingQuery;
        SortQuery = sortQuery;
        FilterQuery = filterQuery;
        SearchQuery = searchQuery;
    }

    public PagingQuery PagingQuery { get; set; }

    public SortQuery SortQuery { get; set; }

    public FilterQuery FilterQuery { get; set; }

    public SearchQuery SearchQuery { get; set; }

    public Locations Location { get; set; }
}
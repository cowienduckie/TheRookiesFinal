using Application.Common.Models;
using Application.Queries;

namespace Application.DTOs.Users.GetListUsers;

public class GetListUsersResponse
{
    public GetListUsersResponse(GetListUsersRequest request, PagedList<UserInfoModel> pagedList)
    {
        PagingQuery = request.PagingQuery;
        SortQuery = request.SortQuery;
        FilterQuery = request.FilterQuery;
        SearchQuery = request.SearchQuery;
        Location = request.Location.ToString();
        Result = pagedList;
    }

    public PagingQuery PagingQuery { get; set; }

    public SortQuery SortQuery { get; set; }

    public FilterQuery FilterQuery { get; set; }

    public SearchQuery SearchQuery { get; set; }

    public string Location { get; set; }

    public PagedList<UserInfoModel> Result { get; set; }
}
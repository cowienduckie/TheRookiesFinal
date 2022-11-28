using Application.Common.Models;
using Application.DTOs.Users.GetUser;

namespace Application.DTOs.Users.GetListUsers;

public class GetListUsersResponse
{
    public GetListUsersResponse(PagedList<GetUserResponse> pagedList)
    {
        Result = pagedList;
    }

    public PagedList<GetUserResponse> Result { get; set; }
}
using Application.Common.Models;

namespace Application.DTOs.Users.GetListUsers;

public class GetListUsersResponse
{
    public PaginatedList<UserInfoModel> UserList { get; set; } = null!;
}
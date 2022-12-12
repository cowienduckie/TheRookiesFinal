using Application.Common.Models;
using Application.DTOs.RequestsForReturning.GetRequestForReturning;

namespace Application.DTOs.RequestsForReturning.GetListRequestsForReturning;

public class GetListRequestsForReturningResponse
{
    public GetListRequestsForReturningResponse(PagedList<GetRequestForReturningResponse> pagedList)
    {
        Result = pagedList;
    }

    public PagedList<GetRequestForReturningResponse> Result { get; }
}
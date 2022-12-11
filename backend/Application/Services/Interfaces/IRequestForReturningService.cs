using Application.Common.Models;
using Application.DTOs.RequestsForReturning.GetListRequestsForReturning;

namespace Application.Services.Interfaces;

public interface IRequestForReturningService
{
    Task<Response<GetListRequestsForReturningResponse>> GetListAsync(GetListRequestsForReturningRequest request);
}
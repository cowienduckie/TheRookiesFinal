using Application.Common.Models;
using Application.DTOs.RequestsForReturning.CreateRequestForReturning;
using Application.DTOs.RequestsForReturning.GetRequestForReturning;

namespace Application.Services.Interfaces;

public interface IRequestForReturningService
{
    Task<Response<GetRequestForReturningResponse>> CreateAsync(CreateRequestForReturningRequest request);
}
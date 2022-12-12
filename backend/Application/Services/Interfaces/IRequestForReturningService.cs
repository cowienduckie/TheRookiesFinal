﻿using Application.Common.Models;
using Application.DTOs.RequestsForReturning.CreateRequestForReturning;
using Application.DTOs.RequestsForReturning.GetRequestForReturning;
using Application.DTOs.RequestsForReturning.GetListRequestsForReturning;

namespace Application.Services.Interfaces;

public interface IRequestForReturningService
{
    Task<Response<GetListRequestsForReturningResponse>> GetListAsync(GetListRequestsForReturningRequest request);
    Task<Response<GetRequestForReturningResponse>> CreateAsync(CreateRequestForReturningRequest request);
}
using Application.Common.Models;
using Application.DTOs.RequestsForReturning.GetListRequestsForReturning;
using Application.DTOs.RequestsForReturning.GetRequestForReturning;
using Application.Helpers;
using Application.Queries;
using Application.Services.Interfaces;
using Domain.Entities.RequestsForReturning;
using Domain.Shared.Enums;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class RequestForReturningService : BaseService, IRequestForReturningService
{
    private readonly IRequestForReturningRepository _requestForReturningRepository;

    public RequestForReturningService(
        IRequestForReturningRepository requestForReturningRepository,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _requestForReturningRepository = requestForReturningRepository;
    }

    public async Task<Response<GetListRequestsForReturningResponse>> GetListAsync(GetListRequestsForReturningRequest request)
    {
        var entities = (await _requestForReturningRepository.ListAsync(rfr => !rfr.IsDeleted))
            .Where(rfr => rfr.Assignment.Asset.Location == request.Location);

        if (request.SortQuery.SortField == ModelField.AssignedDate)
        {
            entities = request.SortQuery.SortDirection switch
            {
                SortDirection.Ascending => entities.OrderBy(r => r.Assignment.AssignedDate),
                SortDirection.Descending => entities.OrderByDescending(r => r.Assignment.AssignedDate),
                _ => entities.OrderBy(r => r.Assignment.AssignedDate)
            };
        }

        var requestsForReturning = entities.AsQueryable()
            .SortByField(new[] { ModelField.ReturnedDate }, request.SortQuery.SortField, request.SortQuery.SortDirection)
            .Select(rfr => new GetRequestForReturningResponse(rfr))
            .AsQueryable();

        var validSortFields = new[]
        {
            ModelField.AssetCode,
            ModelField.AssetName,
            ModelField.RequestedBy,
            ModelField.AcceptedBy,
            ModelField.State
        };

        var validSearchFields = new[]
        {
            ModelField.AssetCode,
            ModelField.AssetName,
            ModelField.RequestedBy
        };

        var validFilterFields = new[]
        {
            ModelField.ReturnedDate,
            ModelField.State
        };

        var filterQueries = new List<FilterQuery>();

        if (!string.IsNullOrEmpty(request.Filter.ReturnedDate))
        {
            filterQueries.Add(new FilterQuery
            {
                FilterField = ModelField.ReturnedDate,
                FilterValue = request.Filter.ReturnedDate
            });
        }

        if (!string.IsNullOrEmpty(request.Filter.State))
        {
            filterQueries.Add(new FilterQuery
            {
                FilterField = ModelField.State,
                FilterValue = request.Filter.State
            });
        }

        var processedList = requestsForReturning
            .MultipleFiltersByField(validFilterFields, filterQueries)
            .SearchByField(validSearchFields, request.SearchQuery.SearchValue)
            .SortByField(validSortFields, request.SortQuery.SortField, request.SortQuery.SortDirection);

        var pagedList = new PagedList<GetRequestForReturningResponse>(
            processedList,
            request.PagingQuery.PageIndex,
            request.PagingQuery.PageSize);

        var responseData = new GetListRequestsForReturningResponse(pagedList);

        return new Response<GetListRequestsForReturningResponse>(true, responseData);
    }
}
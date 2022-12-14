using Application.Common.Models;
using Application.DTOs.RequestsForReturning.GetListRequestsForReturning;
using Application.Helpers;
using Application.Queries;
using Application.DTOs.RequestsForReturning.CreateRequestForReturning;
using Application.DTOs.RequestsForReturning.GetRequestForReturning;
using Application.Services.Interfaces;
using Domain.Entities.Assignments;
using Domain.Entities.RequestsForReturning;
using Domain.Shared.Enums;
using Domain.Entities.Users;
using Domain.Shared.Constants;
using Infrastructure.Persistence.Interfaces;
using Application.DTOs.RequestsForReturning.ApproveRequestForReturning;

namespace Application.Services;

public class RequestForReturningService : BaseService, IRequestForReturningService
{
    private readonly IRequestForReturningRepository _requestForReturningRepository;
    private readonly IAssignmentRepository _assignmentRepository;

    public RequestForReturningService(
        IRequestForReturningRepository requestForReturningRepository,
        IAssignmentRepository assignmentRepository,
        IUnitOfWork unitOfWork) : base(unitOfWork)
    {
        _requestForReturningRepository = requestForReturningRepository;
        _assignmentRepository = assignmentRepository;
    }

    public async Task<Response> ApproveAsync(ApproveRequestForReturningRequest request)
    {
        var returningRequest = await _requestForReturningRepository.GetAsync(rfr => rfr.Id == request.Id);

        if (returningRequest == null ||
            returningRequest.State != RequestForReturningState.WaitingForReturning ||
            returningRequest.Assignment.Asset.Location != request.Approver.Location)
        {
            return new Response(false, ErrorMessages.BadRequest);
        }

        if (request.IsCompleted)
        {
            returningRequest.State = RequestForReturningState.Completed;
            returningRequest.AcceptedBy = request.Approver.Id;
            returningRequest.ReturnDate = DateTime.UtcNow.AddHours(7).Date;
            returningRequest.Assignment.IsDeleted = true;
            returningRequest.Assignment.Asset.State = AssetState.Available;
        }
        else
        {
            returningRequest.IsDeleted = true;
            returningRequest.Assignment.State = AssignmentState.Accepted;
        }

        await _requestForReturningRepository.UpdateAsync(returningRequest);
        await UnitOfWork.SaveChangesAsync();

        return new Response(true, Messages.ActionSuccess);
    }

    public async Task<Response<GetRequestForReturningResponse>> CreateAsync(CreateRequestForReturningRequest request)
    {
        var returnAssignment = await _assignmentRepository
            .GetAsync(a => !a.IsDeleted && a.Id == request.AssignmentId ); 

        if (returnAssignment == null)
        {
            return new Response<GetRequestForReturningResponse>(false, ErrorMessages.BadRequest);
        }

        if (returnAssignment.State != AssignmentState.Accepted)
        {
            return new Response<GetRequestForReturningResponse>(false, ErrorMessages.BadRequest);
        }

        var userRepository = UnitOfWork.AsyncRepository<User>();

        var requester = await userRepository
            .GetAsync(u => !u.IsDeleted && u.Id == request.RequestedBy);

        if (requester == null)
        {
            return new Response<GetRequestForReturningResponse>(false, ErrorMessages.BadRequest);
        }

        var newReturnRequest = new RequestForReturning
        {
            Id = Guid.NewGuid(),
            AssignmentId = request.AssignmentId,
            Assignment = returnAssignment,
            RequestedBy = request.RequestedBy,
            Requester = requester,
            State = RequestForReturningState.WaitingForReturning
        };

        returnAssignment.State = AssignmentState.WaitingForReturning;

        await _assignmentRepository.UpdateAsync(returnAssignment);
        await _requestForReturningRepository.AddAsync(newReturnRequest);
        await UnitOfWork.SaveChangesAsync();

        var responseData = new GetRequestForReturningResponse(newReturnRequest);

        return new Response<GetRequestForReturningResponse>(true, responseData);
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

        if (request.SortQuery.SortField == ModelField.ReturnedDate)
        {
            entities = request.SortQuery.SortDirection switch
            {
                SortDirection.Ascending => entities.OrderBy(r => r.ReturnDate),
                SortDirection.Descending => entities.OrderByDescending(r => r.ReturnDate),
                _ => entities.OrderBy(r => r.ReturnDate)
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
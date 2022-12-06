using Application.Common.Models;
using Application.DTOs.Assignments.GetAssignment;
using Application.DTOs.Assignments.GetListAssignments;
using Application.Helpers;
using Application.Queries;
using Application.Services.Interfaces;
using Domain.Entities.Assignments;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Infrastructure.Persistence.Interfaces;

namespace Application.Services;

public class AssignmentService : BaseService, IAssignmentService
{
    private readonly IAssignmentRepository _assignmentRepository;

    public AssignmentService(
        IUnitOfWork unitOfWork,
        IAssignmentRepository assignmentRepository) : base(unitOfWork)
    {
        _assignmentRepository = assignmentRepository;
    }

    public async Task<Response<GetAssignmentResponse>> GetAsync(GetAssignmentRequest request)
    {
        var assignment = await _assignmentRepository.GetAsync(a => !a.IsDeleted &&
                                                                   a.Id == request.Id);

        if (assignment == null ||
            assignment.Asset.Location != request.Location)
        {
            return new Response<GetAssignmentResponse>(false, ErrorMessages.NotFound);
        }

        var responseModel = new GetAssignmentResponse(assignment);

        return new Response<GetAssignmentResponse>(true, responseModel);
    }

    public async Task<Response<GetListAssignmentsResponse>> GetListAsync(GetListAssignmentsRequest request)
    {
        var assignments = (await _assignmentRepository.ListAsync(a => !a.IsDeleted))
            .Where(a => a.Asset.Location == request.Location)
            .AsQueryable()
            .SortByField(new [] { ModelField.AssignedDate }, request.SortQuery.SortField, request.SortQuery.SortDirection)
            .Select(a => new GetAssignmentResponse(a))
            .AsQueryable();

        var validSortFields = new[]
        {
            ModelField.AssetCode,
            ModelField.AssetName,
            ModelField.AssignedTo,
            ModelField.AssignedBy,
            ModelField.State
        };

        var validSearchFields = new[]
        {
            ModelField.AssetCode,
            ModelField.AssetName,
            ModelField.AssignedTo
        };

        var validFilterFields = new[]
        {
            ModelField.AssignedDate,
            ModelField.State
        };

        var filterQueries = new List<FilterQuery>();

        if (!string.IsNullOrEmpty(request.AssignmentFilter.AssignedDate))
        {
            filterQueries.Add(new FilterQuery
            {
                FilterField = ModelField.AssignedDate,
                FilterValue = request.AssignmentFilter.AssignedDate
            });
        }

        if (!string.IsNullOrEmpty(request.AssignmentFilter.AssignmentState))
        {
            filterQueries.Add(new FilterQuery
            {
                FilterField = ModelField.State,
                FilterValue = request.AssignmentFilter.AssignmentState
            });
        }

        var processedList = assignments
            .MultipleFiltersByField(validFilterFields, filterQueries)
            .SearchByField(validSearchFields, request.SearchQuery.SearchValue)
            .SortByField(validSortFields, request.SortQuery.SortField, request.SortQuery.SortDirection);

        var pagedList = new PagedList<GetAssignmentResponse>(
            processedList,
            request.PagingQuery.PageIndex,
            request.PagingQuery.PageSize);

        var responseData = new GetListAssignmentsResponse(pagedList);

        return new Response<GetListAssignmentsResponse>(true, responseData);
    }

    public async Task<Response<GetListAssignmentsResponse>> GetOwnedListAsync(GetListOwnedAssignmentsRequest request)
    {
        var assignments = (await _assignmentRepository.ListAsync(a => !a.IsDeleted && a.AssignedTo == request.CurrentUser.Id))
            .Select(a => new GetAssignmentResponse(a))
            .AsQueryable();

        var validSortFields = new[]
        {
            ModelField.AssetCode,
            ModelField.AssetName,
            ModelField.AssignedTo,
            ModelField.AssignedBy,
            ModelField.AssignedDate,
            ModelField.State
        };

        var processedList = assignments.SortByField(validSortFields, request.SortQuery.SortField, request.SortQuery.SortDirection);

        var pagedList = new PagedList<GetAssignmentResponse>(
            processedList,
            request.PagingQuery.PageIndex,
            request.PagingQuery.PageSize);

        var responseData = new GetListAssignmentsResponse(pagedList);

        return new Response<GetListAssignmentsResponse>(true, responseData);
    }
}
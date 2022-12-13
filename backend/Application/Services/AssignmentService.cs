using Application.Common.Models;
using Application.DTOs.Assignments.CreateAssignment;
using Application.DTOs.Assignments.DeleteAssignment;
using Application.DTOs.Assignments.GetAssignment;
using Application.DTOs.Assignments.GetListAssignments;
using Application.DTOs.Assignments.RespondAssignment;
using Application.Helpers;
using Application.Queries;
using Application.Services.Interfaces;
using Domain.Entities.Assets;
using Domain.Entities.Assignments;
using Domain.Entities.Users;
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
            .SortByField(new[] {ModelField.AssignedDate}, request.SortQuery.SortField, request.SortQuery.SortDirection)
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
        var assignments =
            (await _assignmentRepository
                .ListAsync(a =>
                    !a.IsDeleted &&
                    a.AssignedTo == request.CurrentUser.Id &&
                    a.State != AssignmentState.Declined &&
                    DateTime.Compare(DateTime.Today, a.AssignedDate.Date) >= 0))
            .AsQueryable()
            .SortByField(new[] {ModelField.AssignedDate}, request.SortQuery.SortField, request.SortQuery.SortDirection)
            .Select(a => new GetAssignmentResponse(a))
            .AsQueryable();

        var validSortFields = new[]
        {
            ModelField.AssetCode,
            ModelField.AssetName,
            ModelField.State
        };

        var processedList = assignments.SortByField(validSortFields, request.SortQuery.SortField,
            request.SortQuery.SortDirection);

        var pagedList = new PagedList<GetAssignmentResponse>(
            processedList,
            request.PagingQuery.PageIndex,
            request.PagingQuery.PageSize);

        var responseData = new GetListAssignmentsResponse(pagedList);

        return new Response<GetListAssignmentsResponse>(true, responseData);
    }

    public async Task<Response> RespondAssignmentAsync(RespondAssignmentRequest request)
    {
        var assignment = await _assignmentRepository.GetAsync(a => !a.IsDeleted && a.Id == request.Id);

        if (assignment == null)
        {
            return new Response(false, ErrorMessages.NotFound);
        }

        if (assignment.State != AssignmentState.WaitingForAcceptance)
        {
            return new Response(false, ErrorMessages.InvalidState);
        }

        assignment.State = request.State;

        await _assignmentRepository.UpdateAsync(assignment);

        await UnitOfWork.SaveChangesAsync();

        return new Response(true, Messages.ActionSuccess);
    }

    public async Task<Response<GetAssignmentResponse>> CreateAsync(CreateAssignmentRequest request)
    {
        var assetRepository = UnitOfWork.AsyncRepository<Asset>();

        var assignedAsset = await assetRepository
            .GetAsync(a => !a.IsDeleted &&
                           a.Id == request.AssetId &&
                           a.State == AssetState.Available);

        if (assignedAsset == null)
        {
            return new Response<GetAssignmentResponse>(false, ErrorMessages.BadRequest);
        }

        var userRepository = UnitOfWork.AsyncRepository<User>();

        var assignee = await userRepository
            .GetAsync(u => !u.IsDeleted &&
                           u.Id == request.AssignedTo);

        var assigner = await userRepository
            .GetAsync(u => !u.IsDeleted &&
                           u.Id == request.AssignedBy);

        if (assignee == null || assigner == null)
        {
            return new Response<GetAssignmentResponse>(false, ErrorMessages.BadRequest);
        }

        var newAssignment = new Assignment
        {
            Id = Guid.NewGuid(),
            AssetId = request.AssetId,
            Asset = assignedAsset,
            AssignedTo = request.AssignedTo,
            Assignee = assignee,
            AssignedBy = request.AssignedBy,
            Assigner = assigner,
            AssignedDate = request.AssignedDate.Date,
            Note = request.Note,
            State = AssignmentState.WaitingForAcceptance
        };

        assignedAsset.State = AssetState.Assigned;

        await assetRepository.UpdateAsync(assignedAsset);
        await _assignmentRepository.AddAsync(newAssignment);
        await UnitOfWork.SaveChangesAsync();

        var responseData = new GetAssignmentResponse(newAssignment);

        return new Response<GetAssignmentResponse>(true, responseData);
    }

    public async Task<Response> DeleteAssignmentAsync(DeleteAssignmentRequest requestModel)
    {
        var existAssignment = await _assignmentRepository.GetAsync(assignment => assignment.Id == requestModel.Id);

        if (existAssignment == null)
        {
            return new Response(false, ErrorMessages.NotFound);
        }

        if (existAssignment.State == AssignmentState.Accepted
            || existAssignment.State == AssignmentState.WaitingForReturning)
        {
            return new Response(false, ErrorMessages.CannotDeleteAssignment);
        }

        existAssignment.IsDeleted = true;

        var assetRepository = UnitOfWork.AsyncRepository<Asset>();

        var currentAsset = await assetRepository.GetAsync(asset => asset.Id == existAssignment.AssetId);

        if (currentAsset != null && existAssignment.State == AssignmentState.WaitingForAcceptance)
        {
            currentAsset.State = AssetState.Available;
            await assetRepository.UpdateAsync(currentAsset);
        }

        await _assignmentRepository.UpdateAsync(existAssignment);
        await UnitOfWork.SaveChangesAsync();

        return new Response(true, Messages.ActionSuccess);
    }
}
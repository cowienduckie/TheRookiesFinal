using Application.Common.Models;
using Application.DTOs.RequestsForReturning.CreateRequestForReturning;
using Application.DTOs.RequestsForReturning.GetRequestForReturning;
using Application.Services.Interfaces;
using Domain.Entities.Assignments;
using Domain.Entities.RequestsForReturning;
using Domain.Entities.Users;
using Domain.Shared.Constants;
using Domain.Shared.Enums;
using Infrastructure.Persistence.Interfaces;

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

    public async Task<Response<GetRequestForReturningResponse>> CreateAsync(CreateRequestForReturningRequest request)
    {
        var returnAssignment = await _assignmentRepository
            .GetAsync(a => !a.IsDeleted &&
                           a.Id == request.AssignmentId ); 

        if (returnAssignment == null)
        {
            return new Response<GetRequestForReturningResponse>(false, ErrorMessages.BadRequest);
        }

        if (returnAssignment.State != AssignmentState.Accepted)
        {
            return new Response<GetRequestForReturningResponse>(false, ErrorMessages.InvalidStateReturn);
        }    

        var userRepository = UnitOfWork.AsyncRepository<User>();

        var requester = await userRepository
            .GetAsync(u => !u.IsDeleted &&
                           u.Id == request.RequestedBy);

        if (requester == null )
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

        returnAssignment.State = AssignmentState.WaitingForAcceptance;

        await _assignmentRepository.UpdateAsync(returnAssignment);
        await _requestForReturningRepository.AddAsync(newReturnRequest);
        await UnitOfWork.SaveChangesAsync();

        var responseData = new GetRequestForReturningResponse(newReturnRequest);

        return new Response<GetRequestForReturningResponse>(true, responseData);
    }
}
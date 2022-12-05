using Application.Common.Models;
using Application.DTOs.Assignments.GetAssignment;
using Application.DTOs.Assignments.GetListAssignments;
using Application.Services.Interfaces;
using Domain.Entities.Assignments;
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
        throw new NotImplementedException();
    }

    public async Task<Response<GetListAssignmentsResponse>> GetListAsync(GetListAssignmentsRequest request)
    {
        throw new NotImplementedException();
    }
}
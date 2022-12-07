using Application.Services.Interfaces;
using Domain.Entities.RequestsForReturning;
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
}
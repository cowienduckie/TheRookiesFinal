using Domain.Entities.RequestsForReturning;
using Domain.Shared.Helpers;

namespace Application.DTOs.RequestsForReturning.GetRequestForReturning;

public class GetRequestForReturningResponse
{
    public GetRequestForReturningResponse(RequestForReturning requestForReturning)
    {
        Id = requestForReturning.Id;
        AssetCode = requestForReturning.Assignment.Asset.AssetCode;
        AssetName = requestForReturning.Assignment.Asset.Name;
        RequestedBy = requestForReturning.Requester.Username;
        AssignedDate = requestForReturning.Assignment.AssignedDate.ToString("dd/MM/yyyy");
        AcceptedBy = requestForReturning.Approver?.Username ?? string.Empty;
        ReturnedDate = requestForReturning.ReturnDate?.ToString("dd/MM/yyyy") ?? string.Empty;
        State = requestForReturning.State.GetDescription() ?? requestForReturning.State.ToString();
    }

    public Guid Id { get; }

    public string AssetCode { get; }

    public string AssetName { get; }

    public string RequestedBy { get; }

    public string AssignedDate { get; }

    public string AcceptedBy { get; }

    public string ReturnedDate { get; }

    public string State { get; }
}
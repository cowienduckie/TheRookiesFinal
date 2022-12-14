using Application.Common.Models;
using Domain.Entities.RequestsForReturning;
using Domain.Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UnitTests.Common;

public class RequestForReturningConstants
{
    public static readonly Guid AssignmentId = new();
    public static readonly Guid RequestedBy = new();
    public static readonly Guid AcceptedBy = new();
    public static readonly DateTime ReturnDate = DateTime.Now;
    public const RequestForReturningState State = RequestForReturningState.WaitingForReturning;

    public const bool IsCompleted = true;

    public static readonly UserInternalModel Approver = new UserInternalModel(Constants.SampleUser);

    public static readonly RequestForReturning SampleRequestForReturning = new RequestForReturning
    {
        Id = AssignmentId,
        RequestedBy = RequestedBy,
        AcceptedBy = AcceptedBy,
        ReturnDate = ReturnDate,
        State = State,
        Assignment = AssignmentConstants.SampleAssignment,
    };

    public static readonly RequestForReturning SampleCompletedRequestForReturning = new RequestForReturning
    {
        Id = AssignmentId,
        RequestedBy = RequestedBy,
        AcceptedBy = AcceptedBy,
        ReturnDate = ReturnDate,
        State = RequestForReturningState.Completed
    };

}


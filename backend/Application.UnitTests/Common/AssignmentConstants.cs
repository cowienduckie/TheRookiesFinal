using Domain.Entities.Assignments;
using Domain.Shared.Enums;

namespace Application.UnitTests.Common;

public static class AssignmentConstants
{
    public static readonly Guid Id = new();

    public static readonly DateTime AssignedDate = DateTime.Now;
    public static string AssignedDateString => AssignedDate.ToString("dd/MM/yyyy");

    public const AssignmentState State = AssignmentState.WaitingForAcceptance;
    public const string StateString = "Waiting for acceptance";

    public static readonly Assignment SampleAssignment = new()
    {
        Id = Id,
        AssetId = AssetConstants.Id,
        Asset = AssetConstants.SampleAsset,
        AssignedTo = Constants.SampleUser.Id,
        Assignee = Constants.SampleUser,
        AssignedBy = Constants.SampleUser.Id,
        Assigner = Constants.SampleUser,
        AssignedDate = AssignedDate,
        State = State
    };

    public static readonly Assignment SampleAcceptedAssignment = new()
    {
        Id = Id,
        AssetId = AssetConstants.Id,
        Asset = AssetConstants.SampleAsset,
        AssignedTo = Constants.SampleUser.Id,
        Assignee = Constants.SampleUser,
        AssignedBy = Constants.SampleUser.Id,
        Assigner = Constants.SampleUser,
        AssignedDate = AssignedDate,
        State = AssignmentState.Accepted
    };

    public static readonly Assignment SampleAssignment2 = new()
    {
        Id = Id,
        AssetId = AssetConstants.Id,
        Asset = AssetConstants.SampleAsset,
        AssignedTo = Constants.SampleUser.Id,
        Assignee = Constants.SampleUser,
        AssignedBy = Constants.SampleUser.Id,
        Assigner = Constants.SampleUser,
        AssignedDate = AssignedDate,
        State = State
    };
}
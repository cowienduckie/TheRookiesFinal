using System.ComponentModel;

namespace Domain.Shared.Enums;

public enum AssignmentState
{
    [Description("Waiting for acceptance")]
    WaitingForAcceptance,
    [Description("Accepted")]
    Accepted,
    [Description("Declined")]
    Declined,
    [Description("Waiting for returning")]
    WaitingForReturning
}
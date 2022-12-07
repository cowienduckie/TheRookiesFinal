using System.ComponentModel;

namespace Domain.Shared.Enums;

public enum RequestForReturningState
{
    [Description("Waiting for returning")]
    WaitingForReturning,
    [Description("Completed")]
    Completed
}
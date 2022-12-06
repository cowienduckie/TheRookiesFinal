using System.ComponentModel;

namespace Domain.Shared.Enums;

public enum AssetState
{
    [Description("Available")]
    Available,
    [Description("Not available")]
    NotAvailable,
    [Description("Assigned")]
    Assigned,
    [Description("Waiting for recycling")]
    WaitingForRecycling,
    [Description("Recycled")]
    Recycled
}
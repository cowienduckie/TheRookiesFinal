using System.ComponentModel;

namespace Domain.Shared.Enums;

public enum AssetState
{
    [Description("Available")]
    Available,
    [Description("Not Available")]
    NotAvailable,
    [Description("Assigned")]
    Assigned,
    [Description("Waiting")]
    Waiting,
    [Description("Recycled")]
    Recycled
}
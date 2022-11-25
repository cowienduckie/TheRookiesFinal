using Domain.Shared.Enums;

namespace API.Queries;

public class FilterQuery
{
    public ModelFields? FilterField { get; set; }
    public string? FilterValue { get; set; }
}
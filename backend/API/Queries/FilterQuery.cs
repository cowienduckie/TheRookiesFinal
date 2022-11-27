using Domain.Shared.Enums;

namespace API.Queries;

public class FilterQuery
{
    public FilterQuery()
    {
        FilterField = ModelFields.None;
    }

    public ModelFields FilterField { get; set; }
    public string? FilterValue { get; set; }
}
using Domain.Shared.Enums;

namespace API.Queries;

public class SortQuery
{
    public SortQuery()
    {
        SortField = ModelFields.FullName;
        SortDirection = SortDirections.Ascending;
    }

    public ModelFields SortField { get; set; }
    public SortDirections SortDirection { get; set; }
}
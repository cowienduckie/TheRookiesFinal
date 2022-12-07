using Domain.Shared.Enums;

namespace Application.Queries;

public class SortQuery
{
    public SortQuery()
    {
        SortField = ModelField.None;
        SortDirection = SortDirection.Ascending;
    }

    public ModelField SortField { get; set; }
    public SortDirection SortDirection { get; set; }
}
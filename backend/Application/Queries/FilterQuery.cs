using Domain.Shared.Enums;

namespace Application.Queries;

public class FilterQuery
{
    public FilterQuery()
    {
        FilterField = ModelField.None;
    }

    public ModelField FilterField { get; set; }
    public string? FilterValue { get; set; }
}

public class FilterQuery<T>
{
    public FilterQuery()
    {
        FilterField = ModelField.None;
    }

    public ModelField FilterField { get; set; }

    public T? FilteredValue { get; set; }
}
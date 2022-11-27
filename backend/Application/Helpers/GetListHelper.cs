using Domain.Shared.Enums;

namespace Application.Helpers;

public static class GetListHelper
{
    public static IEnumerable<T> SortByField<T>(
        this IQueryable<T> source,
        IEnumerable<ModelFields> validSortFields,
        ModelFields sortField,
        SortDirections sortDirection) where T : class
    {
        if (!validSortFields.Contains(sortField))
        {
            return source;
        }

        var prop = typeof(T).GetProperty(sortField.ToString());

        if (prop == null)
        {
            return source;
        }

        return sortDirection switch
        {
            SortDirections.Ascending => source.OrderBy(entity => prop.GetValue(entity)),
            SortDirections.Descending => source.OrderByDescending(entity => prop.GetValue(entity)),
            _ => source
        };
    }

    public static IEnumerable<T> SearchByField<T>(
        this IQueryable<T> source,
        IEnumerable<ModelFields> validSearchFields,
        ModelFields searchField,
        string searchText) where T : class
    {
        if (!validSearchFields.Contains(searchField))
        {
            return source;
        }

        var prop = typeof(T).GetProperty(searchField.ToString());

        if (prop == null ||
            prop.GetType() == typeof(string))
        {
            return source;
        }

        return source.Where(entity => (prop.GetValue(entity) as string)
                                        .Contains(searchText.Trim()));
    }
}
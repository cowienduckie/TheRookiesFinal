using System.Linq.Expressions;
using Domain.Shared.Enums;

namespace Application.Helpers;

public static class GetListHelper
{
    public static IQueryable<T> SortByField<T>(
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

    public static IQueryable<T> SearchByField<T>(
        this IQueryable<T> source,
        IEnumerable<ModelFields> searchFields,
        string? searchText) where T : class
    {
        if (string.IsNullOrEmpty(searchText))
        {
            return source;
        }

        List<Predicate<T>> predicates = new();

        foreach (var searchField in searchFields)
        {
            var prop = typeof(T).GetProperty(searchField.ToString());

            if (prop != null && prop.PropertyType == typeof(string))
            {
                predicates.Add(entity => (prop.GetValue(entity) as string)
                                        !.Contains(searchText.Trim()));
            }
        }

        Expression<Func<T, bool>> expression = entity => predicates.Any(p => p(entity));

        return source.Where(expression);
    }

    public static IQueryable<T> FilterByField<T>(
        this IQueryable<T> source,
        IEnumerable<ModelFields> validFilterFields,
        ModelFields filterField,
        string? filterValue) where T : class
    {
        if (string.IsNullOrEmpty(filterValue) ||
            !validFilterFields.Contains(filterField))
        {
            return source;
        }

        var prop = typeof(T).GetProperty(filterField.ToString());

        if (prop == null ||
            prop.PropertyType != typeof(string))
        {
            return source;
        }

        return source.Where(entity => (prop.GetValue(entity) as string) == filterValue);
    }
}
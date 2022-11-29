namespace Application.Common.Models;

public class PagedList<T>
{
    public PagedList(IQueryable<T> source, int pageIndex, int pageSize)
    {
        PageSize = pageSize;
        TotalRecord = source.Count();
        TotalPage = TotalRecord / PageSize;

        if (TotalRecord % PageSize > 0) ++TotalPage;

        PageIndex = pageIndex > TotalPage ? TotalPage : pageIndex;

        Items = source.Skip((PageIndex - 1) * PageSize).Take(PageSize).ToList();
    }

    public int PageIndex { get; }
    public int PageSize { get; }
    public int TotalRecord { get; }
    public int TotalPage { get; }
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPage;
    public List<T> Items { get; set; }
}
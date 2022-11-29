using Domain.Shared.Constants;

namespace Application.Queries;

public class PagingQuery
{
    private int _pageIndex;
    private int _pageSize;

    public PagingQuery()
    {
        PageIndex = Settings.DefaultPageIndex;
        PageSize = Settings.DefaultPageSize;
    }

    public int PageIndex
    {
        get => _pageIndex;
        set => _pageIndex = value > 0 ? value : Settings.DefaultPageIndex;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > 0 ? value : Settings.DefaultPageSize;
    }
}
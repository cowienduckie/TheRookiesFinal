namespace Application.Common.Models;

public class Response<T>
{
    public Response(bool isSuccess)
    {
        IsSuccess = isSuccess;
    }

    public Response(bool isSuccess, T data)
    {
        IsSuccess = isSuccess;
        Data = data;
    }

    public Response(bool isSuccess, string message)
    {
        IsSuccess = isSuccess;
        Message = message;
    }

    public Response(bool isSuccess, string message, T data)
    {
        IsSuccess = isSuccess;
        Message = message;
        Data = data;
    }

    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
}

public class Response
{
    public Response(bool isSuccess)
    {
        IsSuccess = isSuccess;
    }

    public Response(bool isSuccess, string message)
    {
        IsSuccess = isSuccess;
        Message = message;
    }

    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
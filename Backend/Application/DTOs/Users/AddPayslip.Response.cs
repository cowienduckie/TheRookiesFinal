namespace Application.DTOs.Users;

public class AddPayslipResponse
{
    public Guid UserId { get; set; }
    public decimal TotalSalary { get; set; }
}
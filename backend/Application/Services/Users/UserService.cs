using Infrastructure.Persistence.Interfaces;

namespace Application.Services.Users;

public class UserService : BaseService
{
    public UserService(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    //public async Task<AddUserResponse> AddNewAsync(AddUserRequest request)
    //{
    //    You can you some mapping tools as such as AutoMapper
    //    var user = new ApplicationUser(request.UserName,
    //        request.FirstName,
    //        request.LastName,
    //        request.Address,
    //        request.BirthDate,
    //        request.DepartmentId.Value);

    //    var userRepository = UnitOfWork.AsyncRepository<ApplicationUser>();
    //    await userRepository.AddAsync(user);
    //    await UnitOfWork.SaveChangesAsync();

    //    var response = new AddUserResponse
    //    {
    //        Id = user.Id,
    //        UserName = user.UserName
    //    };

    //    return response;
    //}

    //public async Task<AddPayslipResponse> AddUserPayslipAsync(AddPayslipRequest request)
    //{
    //    var userRepository = UnitOfWork.AsyncRepository<ApplicationUser>();
    //    var user = await userRepository.GetAsync(_ => _.Id == request.UserId);
    //    if (user != null)
    //    {
    //        //var payslip = user.AddPayslip(request.Date.Value,
    //        //    request.WorkingDays.Value,
    //        //    request.Bonus,
    //        //    request.IsPaid);
    //        //await userRepository.UpdateAsync(user);
    //        //await UnitOfWork.SaveChangesAsync();

    //        return new AddPayslipResponse
    //        {
    //            //UserId = user.Id,
    //            //TotalSalary = payslip.TotalSalary
    //        };
    //    }

    //    throw new NotImplementedException();
    //}

    //public async Task<List<UserInfoDTO>> SearchAsync(GetUserRequest request)
    //{
    //    var userRepository = UnitOfWork.AsyncRepository<ApplicationUser>();
    //    var users = await userRepository.ListAsync(_ => _.UserName.Contains(request.Search));
    //    var userDTOs = users.Select(_ => new UserInfoDTO
    //    {
    //        UserName = _.UserName,
    //        FirstName = _.FirstName,
    //        LastName = _.LastName,
    //        Address = _.Address,
    //        BirthDate = _.BirthDate,
    //        DepartmentId = _.DepartmentId,
    //        Id = _.Id
    //    }).ToList();

    //    return userDTOs;

    //    throw new NotImplementedException();
    //}
}
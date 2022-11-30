using Domain.Shared.Constants;
using System.Text.RegularExpressions;

namespace Application.Helpers
{
    public class UserNameHelper
    {
        public static int GetAge(DateTime birthDate)
        {
            var today = DateTime.Now;

            var age = today.Year - birthDate.Year;

            if (today.Month < birthDate.Month || (today.Month == birthDate.Month && today.Day < birthDate.Day)) { age--; }

            return age;
        }

        public static string GetNewStaffCode(string previousStaffCode)
        {
            var number = Regex.Match(previousStaffCode, @"\d+").Value;

            var nextStaffCodeNumber = (number == "" || number == null) ? 1 : Convert.ToInt32(number) + 1;

            return Settings.StaffCodePrefix + nextStaffCodeNumber.ToString().PadLeft(4, '0');
        }

        public static bool CheckValidUserName(string firstName, string lastName, string username)
        {
            var previousUserNameWithoutNumber = Regex.Match(username, @"[a-zA-Z]+").Value;

            return previousUserNameWithoutNumber == GetNewUserNameWithoutNumber(firstName, lastName);
        }

        public static string GetNewUserNameWithoutNumber(string firstName, string lastName)
        {
            var fullName = firstName + " " + lastName;

            var nameWordArray = fullName.Split(" ");

            var userName = nameWordArray[0];

            for (int i = 1; i < nameWordArray.Length; i++)
            {
                userName += nameWordArray[i].Substring(0, 1);
            }

            return userName.ToLower();
        }

        public static string GetNewPassword(string userName, DateTime dateOfBirth)
        {
            return userName.ToLower() + "@" + dateOfBirth.ToString("ddMMyyyy");
        }
    }
}

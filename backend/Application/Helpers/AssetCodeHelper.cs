using Domain.Shared.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Helpers
{
    public class AssetCodeHelper
    {
        public static string GetNewAssetCode(string categoryPrefix, int count)
        {
            var nextAssetCodeNumber = count + 1;

            return categoryPrefix + nextAssetCodeNumber.ToString().PadLeft(6, '0');
        }
    }
}

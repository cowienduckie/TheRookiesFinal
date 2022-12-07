using Domain.Entities.Categories;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Categories
{
    public class CreateCategoryResponse
    {
        public CreateCategoryResponse(Category category)
        {
            Prefix = category.Prefix;
            Name = category.Name;
        }
        public string Prefix { get;}

        public string Name { get;}
    }
}

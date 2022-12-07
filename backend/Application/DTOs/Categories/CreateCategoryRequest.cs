using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Categories
{
    public class CreateCategoryRequest
    {
        [Required]
        public string Prefix { get; set; } = null!;

        [Required]
        public string Name { get; set; } = null!;
    }
}

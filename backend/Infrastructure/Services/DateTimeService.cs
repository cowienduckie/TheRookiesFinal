﻿using Infrastructure.Common.Interfaces;

namespace Infrastructure.Services;

public class DateTimeService : IDateTime
{
    public DateTime Now => DateTime.Now;
}
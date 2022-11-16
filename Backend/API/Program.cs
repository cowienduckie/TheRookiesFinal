using API.Extensions;
using Application;
using Infrastructure;
using Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddWebUiServices();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // TODO: Fix Initializer block
    //using (var scope = app.Services.CreateScope())
    //{
    //    var initializer = scope.ServiceProvider.GetRequiredService<EfContextInitializer>();
    //    await initializer.InitialiseAsync();
    //    await initializer.SeedAsync();
    //}
}

app.UseHealthChecks("/health");

app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
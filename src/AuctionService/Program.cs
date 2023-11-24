using AuctionService.Consumer;
using AuctionService.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<AuctionCreatedFaultConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));

    x.AddEntityFrameworkOutbox<AppDbContext>(opt =>
    {
        opt.QueryDelay = TimeSpan.FromSeconds(30);
        opt.UsePostgres();
        opt.UseBusOutbox();
    });

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.ConfigureEndpoints(context);
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //removing swagger
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

try
{
    SeedData.InitDb(app);
}
catch (System.Exception ex)
{
    Console.WriteLine($"Error ---> {ex.Message}");
    throw;
}

app.Run();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
var app = builder.Build();

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Content-Security-Policy",
        "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self';upgrade-insecure-requests;");
    await next();
});

app.MapControllers();
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();

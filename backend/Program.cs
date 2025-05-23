using LetsSkate.Data;
using LetsSkate.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. DbContext
builder.Services.AddDbContext<ApplicationDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(opts =>
    {
      opts.User.RequireUniqueEmail = true;
      // you can tweak password rules here if desired
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddAuthorization();

// 3. Configure the auth cookie
builder.Services.ConfigureApplicationCookie(opts =>
{
    opts.Cookie.HttpOnly = true;
    opts.Cookie.SameSite = SameSiteMode.Strict;
    opts.ExpireTimeSpan = TimeSpan.FromDays(7);
    opts.LoginPath = "/api/account/login";
    opts.LogoutPath = "/api/account/logout";
});

// 4. CORS, Swagger, etc.
builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 6. Minimal API endpoints for auth

app.UseCors(opts => opts.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseSwagger();
app.UseSwaggerUI();

// 5. Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();
// 7. Auth Endpoints
app.MapPost("/api/account/register", async (UserManager<IdentityUser> users, RegisterModel model) =>
{
    var user = new IdentityUser { UserName = model.Email, Email = model.Email };
    var result = await users.CreateAsync(user, model.Password);
    return result.Succeeded ? Results.Ok() : Results.BadRequest(result.Errors);
})
.WithOpenApi();

app.MapPost("/api/account/login", async (SignInManager<IdentityUser> signin, LoginModel creds) =>
{
    var result = await signin.PasswordSignInAsync(
        creds.Email, creds.Password, creds.RememberMe, lockoutOnFailure: false);
    return result.Succeeded ? Results.Ok() : Results.Unauthorized();
})
.WithOpenApi();

app.MapPost("/api/account/logout", async (SignInManager<IdentityUser> signin) =>
{
    await signin.SignOutAsync();
    return Results.Ok();
})
.WithOpenApi();

// 8. Test Endpoints
app.MapGet("/api/hello", () => "Hello from .NET API!").WithOpenApi();
app.MapGet("/api/protected", () => "Secret data")
   .RequireAuthorization()
   .WithOpenApi();

app.Run();
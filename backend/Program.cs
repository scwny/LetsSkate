var builder = WebApplication.CreateBuilder(args);

// 1. Enable CORS
builder.Services.AddCors(opts =>
  opts.AddDefaultPolicy(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader()));

// 2. Swagger + OpenAPI (optional, from template)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
  .AddDbContext<ApplicationDbContext>(opts => /* your connection */)
  .AddIdentity<ApplicationUser, IdentityRole>(opts => {
    opts.User.RequireUniqueEmail = true;
  })
  .AddEntityFrameworkStores<ApplicationDbContext>()
  .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(opts => {
    opts.Cookie.HttpOnly = true;
    opts.Cookie.SameSite = SameSiteMode.Strict;
    opts.ExpireTimeSpan = TimeSpan.FromDays(7);
    opts.LoginPath = "/Account/Login";          // your login route
    opts.LogoutPath = "/Account/Logout";
});

var app = builder.Build();

// 3. Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();               // apply our CORS policy

// 4. Hello endpoint
app.MapGet("/api/hello", () => "Hello from .NET API!")
   .WithName("GetHello")
   .WithOpenApi();

// 4. Hello endpoint
app.MapGet("/ping", () => "pong!")
   .WithName("ping")
   .WithOpenApi();

app.Run();

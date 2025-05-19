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

app.Run();

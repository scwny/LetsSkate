# Development Environment Setup Plan

## Prerequisites
1. **Git**: Version control system.
2. **Node.js (LTS)**: Runtime for frontend tooling (>=16.x).
3. **.NET SDK (6.0 or later)**: For building the ASP.NET Core backend.
4. **Visual Studio Code**: IDE for development.

## VS Code Extensions
- **C#** (`ms-dotnettools.csharp`): .NET Core support.
- **ESLint** (`dbaeumer.vscode-eslint`): JavaScript/TypeScript linting.
- **Prettier – Code formatter** (`esbenp.prettier-vscode`): Opinionated code formatting.
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): Autocomplete & linting for Tailwind.
- **GitLens — Git supercharged** (`eamodio.gitlens`): Enhanced Git integration.
- **vscode-icons** (`vscode-icons-team.vscode-icons`): File icons for clarity.
- **EditorConfig for VS Code** (`EditorConfig.EditorConfig`): Maintains consistent coding styles.
- *Optional*: **JavaScript and TypeScript Nightly** (`ms-vscode.vscode-typescript-next`): Latest TS features.

## Project Initialization
1. Create a root folder:
   ```bash
   mkdir club-site && cd club-site
   ```
2. Initialize Git:
   ```bash
   git init
   ```
3. Add a `.gitignore` for `node_modules`, `.vs`, `bin/`, `obj/`, etc.

## Backend Setup (ASP NET Core Web API)
1. Scaffold the project:
   ```bash
   dotnet new webapi -o backend
   ```
2. (Optional) Remove the default `WeatherForecast` controller.
3. Add a `HelloController` in `backend/Controllers/HelloController.cs`:
   ```csharp
   [ApiController]
   [Route("api/[controller]")]
   public class HelloController : ControllerBase {
     [HttpGet]
     public string Get() => "Hello from .NET API!";
   }
   ```
4. Enable CORS in `Program.cs`:
   ```csharp
   builder.Services.AddCors(opts =>
     opts.AddDefaultPolicy(policy =>
       policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
   app.UseCors();
   ```
5. Run the API:
   ```bash
   cd backend
   dotnet run
   ```
   It will listen on `http://localhost:5000` (or similar).

## Frontend Setup (React + TypeScript + Vite)
1. Scaffold with Vite:
   ```bash
   cd ../
   npm create vite@latest frontend -- --template react-ts
   ```
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Add Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
4. Configure `tailwind.config.js`:
   ```js
   module.exports = {
     content: ["./index.html", "./src/**/*.{ts,tsx}"],
     theme: { extend: {} },
     plugins: [],
   };
   ```
5. Add Tailwind directives in `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
6. Install React Query:
   ```bash
   npm install @tanstack/react-query
   ```
7. Set up API proxy in `vite.config.ts`:
   ```ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': 'http://localhost:5000'
       }
     }
   });
   ```
8. Create `src/components/Hello.tsx`:
   ```tsx
   import { useQuery } from '@tanstack/react-query';

   const fetchHello = async () => {
     const res = await fetch('/api/hello');
     return res.text();
   };

   export function Hello() {
     const { data, isLoading } = useQuery(['hello'], fetchHello);
     if (isLoading) return <div>Loading...</div>;
     return <div>{data}</div>;
   }
   ```
9. Use `<Hello />` in `src/App.tsx`.

10. Run the frontend:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:5173` to see the greeting.

## Verification
- Confirm the message “Hello from .NET API!” appears in the browser.
- Ensure CORS and proxying work as expected.

## Next Steps
- Integrate authentication (AuthContext).
- Scaffold additional API endpoints.
- Expand styling with Tailwind components.

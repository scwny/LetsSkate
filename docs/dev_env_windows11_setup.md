# LetsSkate Development Environment Setup (Windows 11)

This guide walks you through configuring a fresh Windows 11 machine for developing the LetsSkate project.

---

## Prerequisites

1. **Windows 11** (64‑bit)  
2. **Administrator** privileges on your machine.  
3. **Internet** connection.

---

## 1. Install Git

1. Download the latest Git for Windows from https://git-scm.com/download/win  
2. Run the installer with default options (ensure “Git from the command line” is selected).  
3. Verify in PowerShell:
   ```powershell
   git --version
   ```

---

## 2. Install Node.js (LTS)

1. Download the LTS installer from https://nodejs.org/en/  
2. Run the installer, accept prompts.  
3. Verify:
   ```powershell
   node --version
   npm --version
   ```

---

## 3. Install .NET SDK (8.0 or later)

1. Download .NET SDK from https://dotnet.microsoft.com/download  
2. Run the installer.  
3. Verify:
   ```powershell
   dotnet --info
   ```

---

## 4. Install Visual Studio Code

1. Download VS Code from https://code.visualstudio.com/Download  
2. Run the installer, ensure “Add to PATH” is checked.  
3. Verify:
   ```powershell
   code --version
   ```

---

## 5. (Optional) Install Windows Terminal

1. Open Microsoft Store → Search “Windows Terminal” → Install.  
2. Provides tabs and PowerShell + WSL integration.

---

## 6. Install VS Code Extensions

Open a VS Code window and run in its integrated terminal (or use the Extensions pane):

```powershell
code --install-extension ms-dotnettools.csharp
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension eamodio.gitlens
code --install-extension vscode-icons-team.vscode-icons
code --install-extension EditorConfig.EditorConfig
# Optional
code --install-extension ms-vscode.vscode-typescript-next
```

---

## 7. Clone the LetsSkate Repository

In PowerShell:

```powershell
cd $HOME\projects            # or your preferred folder
git clone https://github.com/scwny/LetsSkate.git
cd LetsSkate
```

---

## 8. Backend Setup

```powershell
cd backend
dotnet restore
# Install EF tools if not already
dotnet tool install --global dotnet-ef
# Apply EF migrations
dotnet ef database update
# Start the API
dotnet run
```

- By default the API listens on `http://localhost:5116`.  
- You can test:
  ```powershell
  Invoke-RestMethod http://localhost:5116/api/hello
  ```

---

## 9. Frontend Setup

Open a new terminal tab:

```powershell
cd ..rontend
npm install
npm run dev
```

- Dev server runs at **http://localhost:5173**  
- Hot Module Replacement (HMR) updates the UI instantly on save.

---

## 10. Running the Full Stack

1. **Backend**: PowerShell tab 1 → `dotnet run`  
2. **Frontend**: PowerShell tab 2 → `npm run dev`  
3. Open **http://localhost:5173** in your browser.  
4. You should see the styled LetsSkate app and the Hello component fetching from the API.

---

## Quick Diagram

```
+----------------+        +----------------+       +---------------+
|                |        |    Backend     |       |   Database    |
|  LetsSkate     | <----> | ASP NET Core   | <-->  | (SQL Server)  |
|  Frontend      |        |  Web API       |       |               |
|  Vite + React  |        +----------------+       +---------------+
|  Tailwind JIT  |
+----------------+
```

---

## Next Steps

- Build out **member dashboard** under `/dashboard`.  
- Implement **admin console** under `/admin`.  
- Customize **Tailwind theme** in `tailwind.config.cjs`.  
- Set up **CI/CD** with GitHub Actions, AWS Amplify, and Elastic Beanstalk.

Happy coding!  

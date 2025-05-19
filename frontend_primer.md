# Front-End Architecture Primer for LetsSkate

## Introduction
This document provides a high-level tutorial and overview of the front-end architecture for the LetsSkate web application. It is intended for developers familiar with HTML and CSS, but new to modern front-end toolchains like Vite, React, and Tailwind CSS.

---

## Table of Contents
1. [Tech Stack Overview](#tech-stack-overview)
2. [How It All Fits Together](#how-it-all-fits-together)
3. [Development Workflow](#development-workflow)
4. [Adding a New Static Page](#adding-a-new-static-page)
5. [Styling with Tailwind CSS](#styling-with-tailwind-css)
6. [Customizing the Tailwind Theme](#customizing-the-tailwind-theme)
7. [Troubleshooting & Tips](#troubleshooting--tips)
8. [Diagram](#diagram)

---

## Tech Stack Overview
- **Vite**: A lightning-fast build tool and development server.  
- **React + TypeScript**: A component-based UI library with static typing.  
- **React Router**: Client-side routing library for mapping URLs to React components.  
- **React Query**: Data-fetching and state-management library for server state.  
- **Tailwind CSS**: Utility-first CSS framework with Just-In-Time (JIT) compiling.

---

## How It All Fits Together
1. **Vite** serves `index.html`, launches a dev server with HMR, and compiles modules on demand.  
2. **`main.tsx`** imports global CSS (`index.css`) and wraps the app in providers (React Query, Auth).  
3. **React Router** listens to URL changes and renders the matching component tree.  
4. **React Query** fetches API data (e.g., `/api/hello`), caches, and updates UI.  
5. **Tailwind CSS JIT** scans your files for class names on build or HMR, generates scoped CSS, and injects it into the page via `<style>` tags.

---

## Development Workflow
1. **Start Dev Server**  
   ```bash
   npm run dev
   ```  
   Vite serves your app at `localhost:5173` with fast refresh.

2. **Editing Code**  
   - **TSX**: Modify React components in `src/`.  
   - **CSS**: Use utility classes in JSX and edit `src/index.css` for base imports.  
   - **Config**: Adjust `tailwind.config.cjs` or `vite.config.ts` for custom behavior.

3. **Build for Production**  
   ```bash
   npm run build
   ```  
   Vite creates an optimized `dist/` directory for deployment.

---

## Adding a New Static Page
1. **Create Component**  
   - Add `src/pages/About.tsx`:
     ```tsx
     export function About() {
       return <div className="p-6"><h2>About LetsSkate</h2><p>Our club info...</p></div>;
     }
     ```
2. **Update Routes**  
   - In `src/App.tsx`, import and add:
     ```tsx
     <Route path="/about" element={<About />} />
     ```
3. **Add Navigation**  
   - Add `<Link to="/about" className="hover:underline">About</Link>` to your header.

---

## Styling with Tailwind CSS
- **Utility-First**: Compose styles directly in your JSX using classes like `bg-gray-800`, `text-white`, `p-4`, `rounded`.
- **JIT Engine**: Scans your content files (`index.html`, `src/**/*.{js,ts,jsx,tsx}`) and generates only the classes you use.
- **Global Imports**: `src/index.css` contains:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- **Responsive**: Prefix classes with screen sizes: `md:text-xl`, `lg:p-8`.
- **State Variants**: Use `hover:bg-blue-500`, `focus:ring`, `active:opacity-75`.

---

## Customizing the Tailwind Theme
Edit **`tailwind.config.cjs`**:
```js
module.exports = {
  content: ["index.html", "src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skateBlue: "#1e3a8a",
        skatePink: "#db2777",
      },
      spacing: {
        '72': '18rem',
      },
    },
  },
  plugins: [],
};
```
- **Custom Colors**: Refer in JSX: `bg-skateBlue`, `text-skatePink`.
- **Additional Spacing**: `mt-72`, `p-72`.

---

## Troubleshooting & Tips
- **No Styles?** Ensure `@tailwind` directives and correct config globs.  
- **HMR Issues**: Restart Vite after config changes.  
- **Class Names**: Use VS Code Tailwind IntelliSense for suggestions.  
- **Performance**: Purge unused styles in production with `mode: 'jit'` and proper `content` settings.

---

## Diagram
```
+-------------------+     +---------------+     +--------------+
| Developer Edits   | --> | Vite Dev Server| --> | Browser HMR |
| (TSX, CSS, Config)|     | (HMR, JIT CSS) |     | (Injected   |
+-------------------+     +---------------+     |  styles)     |
                                                +--------------+

Build Flow:
TSX + CSS -> Vite (ESM) -> React Router -> React Query -> Tailwind JIT -> DOM
```

---

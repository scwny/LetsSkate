# Architecture Design Decisions Summary

Our choices are driven by balancing rapid development, strong type safety, minimal operational overhead, and cost efficiency. We selected React + TypeScript and Tailwind CSS to ensure a consistent, maintainable front-end with rapid prototyping capabilities. React Query and a simple AuthContext provide efficient data fetching and session handling with minimal boilerplate. On the backend, a REST API with ASP.NET Core and EF Core leverages your existing .NET expertise and offers robust data modeling and migrations. Hosting via AWS Amplify for static assets and Elastic Beanstalk for the API aligns with your AWS familiarity, provides built-in CI/CD, free-tier eligibility, and low operational complexity. Finally, GitHub Actions and Amplify CI streamline deployments, ensuring that code changes propagate automatically to production with minimal setup.

## Front-End
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS (utility-first for rapid, consistent design)
- **State Management**:
  - **Server State**: React Query for data fetching, caching, background updates
  - **Client State**: Simple AuthContext for authentication/session data

## API
- **Style**: REST API using ASP.NET Core Web API
- **Data Access**: EF Core (code-first migrations and LINQ)

## Hosting
- **Front-End**: AWS Amplify Console
  - Git-driven CI/CD, free tier (5 GB storage, 15 GB bandwidth)
- **API**: Elastic Beanstalk on t3.micro (.NET 6 Web API)
  - Free-tier eligible for 12 months, automatic health checks and scaling

## CI/CD
- **Front-End**: AWS Amplify Console auto-deploy on Git push
- **API**: GitHub Actions workflow to build and deploy to Elastic Beanstalk

# CI/CD Pipeline for LetsSkate (GitHub Actions)

This document describes how to set up continuous integration and continuous deployment (CI/CD) for the **main** branch of the LetsSkate repository using GitHub Actions, Elastic Beanstalk for the backend, and S3 + CloudFront for the frontend.

---

## 1. AWS Preparation

1. **Create an IAM user** with programmatic access and the following managed policies:
   - `AWSElasticBeanstalkFullAccess`
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
2. **Note** the **Access Key ID** and **Secret Access Key**.

3. **Create an S3 bucket** for the frontend build artifacts (e.g. `lets-skate-frontend-bucket`).

4. **(Optional) Create or note CloudFront distribution** to serve from the S3 bucket.

5. **Elastic Beanstalk**:
   - Create an **Application** (e.g. `LetsSkateBackend`).
   - Create an **Environment** (e.g. `LetsSkate-env`) using the **.NET Core** platform.

---

## 2. GitHub Secrets

In your GitHub repo **Settings → Secrets and variables → Actions**, add:

| Name                       | Value                                     |
|----------------------------|-------------------------------------------|
| `AWS_ACCESS_KEY_ID`        | _From your IAM user_                      |
| `AWS_SECRET_ACCESS_KEY`    | _From your IAM user_                      |
| `AWS_REGION`               | e.g. `us-east-1`                          |
| `EB_APP_NAME`              | e.g. `LetsSkateBackend`                   |
| `EB_ENV_NAME`              | e.g. `LetsSkate-env`                      |
| `S3_BUCKET`                | e.g. `lets-skate-frontend-bucket`         |
| `CF_DISTRIBUTION_ID`       | _(Optional) Your CloudFront ID_           |

---

## 3. GitHub Actions Workflow

Create a file `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-backend:
    name: Build & Test Backend
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'

      - name: Restore & Build
        run: |
          cd backend
          dotnet restore
          dotnet build --configuration Release

      - name: Run Tests (if any)
        run: |
          cd backend
          dotnet test --no-build --configuration Release

  deploy-backend:
    name: Deploy Backend to Elastic Beanstalk
    needs: build-backend
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup AWS creds
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v20
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          region: ${{ secrets.AWS_REGION }}
          application_name: ${{ secrets.EB_APP_NAME }}
          environment_name: ${{ secrets.EB_ENV_NAME }}
          version_label: ${{ github.sha }}
          deployment_package: backend/bin/Release/net8.0/publish

  build-frontend:
    name: Build Frontend
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'

      - name: Install Dependencies
        run: |
          cd frontend
          npm ci

      - name: Build
        run: |
          cd frontend
          npm run build

      - name: Archive production artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-dist
          path: frontend/dist

  deploy-frontend:
    name: Deploy Frontend to S3 & CloudFront
    needs: build-frontend
    runs-on: ubuntu-latest
    steps:
      - name: Download frontend artifact
        uses: actions/download-artifact@v3
        with:
          name: frontend-dist
          path: frontend_dist

      - name: Setup AWS creds
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Sync to S3
        run: |
          aws s3 sync frontend_dist/dist s3://${{ secrets.S3_BUCKET }} --delete

      - name: Invalidate CloudFront Cache
        if: secrets.CF_DISTRIBUTION_ID != ''
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} --paths "/*"
```

---

## 4. Verification

1. **Push** a commit to `main`.  
2. **GitHub Actions** tab → confirm the **CI/CD Pipeline** workflow runs successfully.  
3. **Backend**  
   - The Elastic Beanstalk environment should update with the new build.  
4. **Frontend**  
   - The S3 bucket should contain updated `index.html` and assets.  
   - If using CloudFront, confirm new content is served.

---

## Next Steps

- Add automated tests for the frontend (e.g. Cypress, React Testing Library).  
- Configure notifications (Slack, email) on CI failures.  
- Secure your AWS credentials with least-privilege IAM policies.  

Happy Deployments!  

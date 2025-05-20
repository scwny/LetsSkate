# Branching Strategy SOP for LetsSkate

## Overview
This document outlines the Standard Operating Procedure (SOP) for Git branching and releases using the Gitflow model. It ensures structured development, quality control, and seamless CI/CD integration.

---

## Branch Types

1. **`main`**  
   - Represents the production code.  
   - Only updated via merges from `release/*` or `hotfix/*`.  
   - Triggers production deployments.

2. **`develop`**  
   - Holds the latest integrated features and fixes.  
   - Basis for feature branches.  
   - Triggers deployments to the staging environment.

3. **`feature/*`**  
   - Named `feature/<feature-name>`.  
   - Branch off from `develop`.  
   - Contains work-in-progress for new features.  
   - Merged back into `develop` via Pull Request.

4. **`release/*`**  
   - Named `release/vX.Y.Z`.  
   - Forked from `develop` when ready for stabilization.  
   - Only bug fixes, documentation updates, and release tasks occur here.  
   - Merged into both `main` and `develop`, and tagged.

5. **`hotfix/*`**  
   - Named `hotfix/<issue-name>` or `hotfix/vX.Y.Z`.  
   - Branch off from `main` to address critical production issues.  
   - Merged into both `main` and `develop`, and tagged if versioned.

---

## Workflow Steps

### A. Feature Development

```powershell
# Ensure you're on develop
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/add-events-page

# Work on the feature...
git add .
git commit -m "feat(events): add Events calendar stub"

# Push and open a PR
git push -u origin feature/add-events-page
```

1. Open a Pull Request (PR) to `develop`.  
2. Conduct code review and testing.  
3. Merge PR into `develop` when approved.

---

### B. Preparing a Release

```powershell
# Update develop, then create a release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Bump version, update changelog, finalize docs
git commit -am "chore(release): prepare v1.0.0"

# Push release branch
git push -u origin release/v1.0.0

# (CI Deploys to staging for QA)
```

Once QA approves:

```powershell
# Merge into main and tag
git checkout main
git merge --no-ff release/v1.0.0 -m "chore(release): merge v1.0.0"
git tag v1.0.0
git push origin main --tags

# Back-merge into develop
git checkout develop
git merge --no-ff release/v1.0.0 -m "chore(release): back-merge v1.0.0"
git push origin develop
```

---

### C. Hotfix

```powershell
# Start from main, create hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/fix-login-bug

# Apply the fix
git add .
git commit -m "fix(auth): correct login redirect issue"

# Push and open a PR if desired
git push -u origin hotfix/fix-login-bug
```

After verification:

```powershell
# Merge back into main and tag
git checkout main
git merge --no-ff hotfix/fix-login-bug -m "fix(auth): hotfix login redirect"
git tag v1.0.1
git push origin main --tags

# Back-merge into develop
git checkout develop
git merge --no-ff hotfix/fix-login-bug -m "fix(auth): back-merge hotfix login redirect"
git push origin develop
```

---

## CI/CD Integration

Use GitHub Actions with these triggers:

```yaml
on:
  push:
    branches:
      - develop
      - main
    tags:
      - 'v*.*.*'
  pull_request:
    branches:
      - develop
```

- **develop**: Runs tests and deploys to **staging** on merge.  
- **release/**: Validates release builds.  
- **main** or **tags**: Deploys to **production**.

---

## Branching Diagram

```
        +-------------------------------------------+
        |               main (production)           |
        +-------------------------------------------+
                      ^           ^
                      | merge      | tag & deploy
                   merge         deploy
                      |           |
        +-------------------------------------------+
        |             release/vX.Y.Z                |
        +-------------------------------------------+
                      ^          |
                      |          |
                  merge         |
                      |          |
        +-------------------------------------------+
        |             develop (staging)             |
        +-------------------------------------------+
         ^      ^      ^        ^      ^      ^
         |      |      |        |      |      |
    feature/...   ...   ...   hotfix/...   ...
```

---

## Next Steps

1. Implement GitHub Actions workflows per above triggers.  
2. Define AWS staging and production environments.  
3. Begin feature branches for upcoming work.

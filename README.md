# Anonymized Compliance Checker - Contribution Guide

Welcome to the **Anonymized Compliance Checker** project! This guide outlines how to contribute effectively to ensure a professional, maintainable, and collaborative codebase.

---

## 📁 Repository Structure

```
/ (root)
├── anonymized-compliance-checker-frontend   # React or any frontend code
├── anonymized-compliance-checker-web2    # NestJS code
├── anonymized-compliance-checker-web3   # Hardhat smart contracts and blockchain logic
```

## 🌳 Branching Strategy

-   **master** (🔒 Protected) — Always stable and production-ready.
-   **task-1** — All features and fixes related to Task 1.
-   **task-2** — All features and fixes related to Task 2.
-   **task-3** — All features and fixes related to Task 3.

Each task branch is derived from `master` and merges **only via pull requests**.

---

## ✅ Contribution Workflow

1. **Fork the Repository** (if external contributor)

2. **Clone the Repo**

    ```bash
    git clone https://github.com/Samonto-Karmaker/Anonymized-Compliance-Checker.git
    cd Anonymized-Compliance-Checker
    ```

3. **Checkout to a Task Branch**

    ```bash
    git checkout task-1  # or task-2, task-3
    ```

4. **Make Changes**

    - Commit message should follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
    - Keep logic modular and follow project structure

5. **Push Your Changes**

    ```bash
    git push origin task-1
    ```

6. **Create a Pull Request to `master`**

    - Pull Requests must pass all checks (tests, linters)
    - Include a clear summary of changes
    - Tag reviewers appropriately

---

## 🔒 Pull Request Rules

-   Only submit **PRs to the `master` branch**.
-   One feature/fix per pull request.
-   All PRs must be reviewed and approved before merging.
-   Include related issue/ticket numbers in PRs when applicable.

---

## 📋 Best Practices

-   Use `.env.example` for environment variables in all subfolders.
-   Use Prettier and ESLint for code formatting (frontend/backend).
-   Keep commits atomic and logically grouped.
-   Write tests where applicable (unit/integration/e2e).
-   Document public functions and smart contracts clearly.

**Thank you for contributing!**

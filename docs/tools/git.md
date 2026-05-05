# Git for Analysts

As data analysis moves towards "Analytics as Code" (e.g., dbt, Python scripts, stored procedures), Version Control using Git is a mandatory skill.

## Why Analysts Need Git

1.  **Reproducibility:** You can always go back to the exact code that generated a specific report.
2.  **Collaboration:** Multiple analysts can work on the same project without overwriting each other's work (using branches).
3.  **Code Review:** Peers can review your SQL logic or Python code before it is merged into production.

## The Basic Workflow

1.  **Clone:** Copy the remote repository (from GitHub/GitLab) to your local machine.
    ```bash
    git clone https://github.com/your-org/your-repo.git
    ```
2.  **Branch:** Create a new workspace for your specific task (never work directly on the `main` branch).
    ```bash
    git checkout -b feature/update-churn-query
    ```
3.  **Edit:** Make changes to your SQL, Python, or Markdown files.
4.  **Add (Stage):** Tell Git which modified files you want to include in the next save.
    ```bash
    git add my_query.sql
    ```
5.  **Commit:** "Save" the changes with a descriptive message.
    ```bash
    git commit -m "Updated the churn calculation to exclude test users"
    ```
6.  **Push:** Send your local branch up to the remote repository.
    ```bash
    git push origin feature/update-churn-query
    ```
7.  **Pull Request (PR):** Go to GitHub/GitLab and open a PR. Ask a peer to review your code. Once approved, it is merged into `main`.

## `.gitignore` Best Practices

The most important rule for Data Analysts: **Never commit raw data to Git!** 

Git is meant for tracking code, not massive `.csv`, `.parquet`, or database dump files. If you commit a 500MB CSV file, it will bloat the repository and potentially leak sensitive PII (Personally Identifiable Information).

Always ensure you have a `.gitignore` file that ignores data formats:
```text
# .gitignore
*.csv
*.xlsx
*.parquet
*.sqlite
.env
__pycache__/
```

## Useful Commands

*   `git status` - Shows which files are modified, staged, or untracked.
*   `git log` - Shows the history of commits.
*   `git pull` - Fetches the latest changes from the remote repository to your local machine.

## References
*   [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
*   [GitHub - Hello World](https://docs.github.com/en/get-started/quickstart/hello-world)

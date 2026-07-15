# The Data Bible (TDB)

A knowledge base covering four data roles: database administration, data engineering, analytics engineering, and data analysis.

> Live site: <https://jack2000-dev.github.io/DAB/>

## How it's organized

By **career role**, not by topic. The tab bar follows the progression **DBA → DE → AE → DA**, plus a shared Resources tab:

| Tab | Covers |
|-----|--------|
| **Database Administrator** | Indexes, partitioning, replication, views, scalability, OLTP/OLAP |
| **Data Engineer** | ETL/ELT, ingestion, Kafka/Airflow/dbt, pipelines |
| **Analytics Engineer** | Foundations, data modeling, ELT process, dbt, version control, ADLC |
| **Data Analyst** | Ask→Act process, data cleaning, Python, SQL, visualization, AI for DA, soft skills |
| **Resources** | Glossary, templates, cheatsheets, books, tutorials, datasets |

Each role tab follows the same five-page shape — Overview, Fundamentals, Practical Snippets, Case Study, Materials — so you always know where to look. Analytics Engineer runs deeper.

There is **one glossary** for the whole site, under Resources. Terms from every role share it.

## Naming

**TDB** is the display name. The repository and the published site path remain **DAB** — renaming the repo would break every existing link to the site, since GitHub does not [redirect Pages URLs](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository).

## Local development

Requires [`uv`](https://docs.astral.sh/uv/).

```bash
uv sync --dev
uv run zensical serve            # http://localhost:8000
uv run zensical build --clean    # output to site/
```

Built with [Zensical](https://zensical.org/). The build must report "No issues found" — it catches broken links and missing nav targets.

## Deploy

Push to `main` triggers `.github/workflows/docs.yml`, which builds and deploys to GitHub Pages. Tags do not trigger a deploy.

Enable Pages once: **Settings → Pages → Source: GitHub Actions**.

## Maintenance

This repo is self-maintaining via `CLAUDE.md` and the `wiki-maintainer` skill at `.claude/skills/wiki-maintainer/SKILL.md`. Open with Claude Code, ask it to add or update content; it follows the maintainer rules and verifies the build.

Adding a page to a role tab means updating three things: the file, the `## Pages` list in that role's `index.md`, and `nav` in `zensical.toml`.

## License

MIT — see [LICENSE](LICENSE).

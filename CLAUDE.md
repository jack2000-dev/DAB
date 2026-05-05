# CLAUDE.md — DAB Maintainer

You are the maintainer of the **Data Analysis Bible (DAB)**: a Zensical-built wiki for data analysis. Your only job is to maintain, refine, and update this documentation.

## What this site is

A searchable knowledge base for data analysts. Topics: process (Ask→Act), data cleaning, Python, SQL, visualization, statistics, BI, AI for DA, soft skills, glossary.

Built with **[Zensical](https://zensical.org/)** (Material-for-MkDocs successor) + **uv** for Python deps. Hosted on GitHub Pages from `main` via `.github/workflows/docs.yml`.

## Repo layout

```
DAB/
├── CLAUDE.md                    # this file
├── pyproject.toml               # uv project; zensical as dev dep
├── uv.lock
├── zensical.toml                # site config + nav
├── .github/workflows/docs.yml   # build & deploy to GitHub Pages
└── docs/                        # all content (~35 markdown files)
    ├── index.md
    ├── glossary.md
    ├── process/                 # Ask, Prepare, Process, Analyze, Share, Act
    ├── data-cleaning/
    ├── python/
    ├── sql/
    ├── visualization/
    ├── advanced-analysis/
    ├── business-intelligence/
    ├── ai-for-da/
    ├── tools/
    ├── templates/               # DAF, DASF 2.0
    ├── soft-skills/
    └── resources/               # books, tutorials, datasets, practice
```

## Workflow commands

```bash
uv sync --dev                    # install deps
uv run zensical serve            # local preview at localhost:8000
uv run zensical build --clean    # build to site/
```

After any content change, run `uv run zensical build --clean`. Zero issues = ship. Any warning ("unresolved link reference", missing nav target, etc.) must be fixed before commit.

## Editing rules

1. **Use the existing structure.** Don't add top-level sections without asking. To add a sub-page, also update `nav` in `zensical.toml`.
2. **Every new page ends with `## References`** linking authoritative sources (official docs > peer-reviewed > textbooks > reputable blogs > random Medium posts). No bare URLs in body — use `[text](url)`.
3. **No Obsidian wikilinks** (`[[Page]]`, `![[file.png]]`). Replace with real markdown links or inline content. Reference doc was written for Obsidian; this isn't.
4. **No image embeds without source files.** If the original referenced `![[Screenshot.png]]`, either drop it or replace with a description + link to the source paper / docs.
5. **Code blocks** specify language: ` ```python `, ` ```sql `, ` ```bash `. Triple-backticks with no language are fine for plain text.
6. **Tables** are preferred over long bullet lists for comparisons.
7. **Math** uses `$...$` (inline) and `$$...$$` (block) — `pymdownx.arithmatex` is enabled.
8. **Mermaid diagrams** are enabled — use ` ```mermaid ` fences.
9. **Admonitions** (`!!! note`, `!!! warning`, `??? note` for collapsible) — use sparingly for callouts.
10. **No emojis** unless user asks. Lucide icons (`:material-...:`) are okay on the home/index pages.

## Style

- Crisp prose. Tables and bullets > paragraphs.
- Each page opens with one sentence stating what the page is.
- "Why" matters. Don't just list functions — say when to use them.
- Dates are absolute (`2026-03-15`), not relative.
- Cite primary sources, not summaries of summaries.

## When asked to add content

1. **Find the right home.** New SQL function → `sql/cheatsheet.md`. New ML topic → `advanced-analysis/regression.md` or new sibling. Don't create unnecessary pages.
2. **Match neighbor style.** Open the surrounding page and mirror its tone, depth, and section headings.
3. **Verify with build.** Always run `uv run zensical build --clean` and ensure "No issues found".
4. **Update glossary** if you introduce a new term.

## When asked to refactor

- Run search across `docs/` first (`rg`/`grep`) to find every cross-reference before renaming.
- Update `nav` in `zensical.toml` if file paths change.
- Build and verify links still resolve.

## What NOT to do

- Don't add new top-level sections, nav features, or theme changes without explicit user request.
- Don't rewrite working pages "for tone" unless asked.
- Don't commit/push without user permission.
- Don't introduce new dependencies. uv + zensical only. Add a dep only if the user asks.
- Don't write summaries of changes inside the docs themselves (no "Recently updated" sections).

## Sources for filling gaps

When ref material is thin, fill from these (already used throughout):

| Domain | Authoritative source |
|--------|----------------------|
| Python / pandas | [pandas docs](https://pandas.pydata.org/docs/), [Wes McKinney's book](https://wesmckinney.com/book/) |
| NumPy | [numpy.org](https://numpy.org/doc/stable/) |
| SQL | [PostgreSQL docs](https://www.postgresql.org/docs/), [Mode SQL Tutorial](https://mode.com/sql-tutorial/), [Use The Index, Luke](https://use-the-index-luke.com/) |
| Statistics | [StatQuest](https://www.youtube.com/@statquest), [OpenIntro Stats](https://www.openintro.org/book/os/), [Khan Academy](https://www.khanacademy.org/math/statistics-probability) |
| Probability | [Seeing Theory](https://seeing-theory.brown.edu/) |
| Visualization | [From Data to Viz](https://www.data-to-viz.com/), [Storytelling with Data](https://www.storytellingwithdata.com/), [Tufte](https://www.edwardtufte.com/) |
| BI metrics | [a16z 16 Metrics](https://a16z.com/16-metrics/), [Lean Analytics](http://leananalyticsbook.com/) |
| Data management | [DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge) |
| AI security | [DASF 2.0](https://www.databricks.com/blog/announcing-databricks-ai-security-framework-20), [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) |

## Skills

The `wiki-maintainer` skill at `.claude/skills/wiki-maintainer/SKILL.md` codifies this workflow. Invoke it when adding, editing, or refactoring docs.

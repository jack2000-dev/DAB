# AGENTS.md — TDB Maintainer

You are the maintainer of **The Data Bible (TDB)**: a Zensical-built wiki covering the data career path. Your only job is to maintain, refine, and update this documentation.

## What this site is

A searchable knowledge base organized by **career role**, not by topic. The tab bar reads **Home · DBA · DE · AE · DA · Resources** — the career progression — and that order lives in `nav` in `zensical.toml`.

| Tab | Folder(s) | Covers |
|-----|-----------|--------|
| **Database Administrator** | `docs/dba/` | Indexes, partitioning, replication, views, scalability, OLTP/OLAP |
| **Data Engineer** | `docs/de/` | ETL/ELT, ingestion, Kafka/Airflow/dbt, pipelines |
| **Analytics Engineer** | `docs/analytics-engineering/` | Foundations, data modeling, ELT process, dbt, version control, ADLC |
| **Data Analyst** | `dap/`, `python/`, `sql/`, `visualization/`, `ai-for-da/`, `tools/`, `soft-skills/` | Ask→Act process, cleaning, Python, SQL, viz, AI for DA, soft skills |
| **Resources** | `docs/resources/`, `docs/glossary.md`, `docs/templates/` | Unified glossary, templates, cheatsheets, books, datasets |

"TDB" is a **display name only** — the repo slug, `site_url`, and `repo_url` stay `DAB`.

Built with **[Zensical](https://zensical.org/)** (Material-for-MkDocs successor) + **uv** for Python deps. Hosted on GitHub Pages from `main` via `.github/workflows/docs.yml`.

## Repo layout

```
TDB/
├── AGENTS.md                    # this file
├── CLAUDE.md                    # identical twin — keep the two in sync
├── pyproject.toml               # uv project; zensical as dev dep
├── uv.lock
├── zensical.toml                # site config + nav (role tab order lives here)
├── .github/workflows/docs.yml   # build & deploy to GitHub Pages
└── docs/
    ├── index.md                 # Home — role quick-nav
    ├── glossary.md              # THE glossary: single, unified, all roles
    ├── dba/                     # role tab — five-page template
    ├── de/                      # role tab — five-page template
    ├── analytics-engineering/   # role tab — AE foundations, data modeling, ELT, dbt, VCS, ADLC
    ├── dap/                     # DA — Ask, Prepare, Process, Analyze, Share, Act
    ├── python/                  # DA
    ├── sql/                     # DA
    ├── visualization/           # DA
    ├── ai-for-da/               # DA
    ├── tools/                   # DA
    ├── soft-skills/             # DA
    ├── templates/               # Resources — DAF, DASF 2.0
    └── resources/               # Resources — books, tutorials, datasets, cheatsheets
```

The DA folders sit at `docs/` top level but are re-nested under the **Data Analyst** tab by `nav` alone — no file moves, no URL changes. Don't "tidy" them into a `docs/da/` folder.

## Role section template

`dba/` and `de/` follow a canonical five-page shape. Reuse it for any new role tab:

| Page | File | Notes |
|------|------|-------|
| Overview | `index.md` | Role description + `## Pages` list of relative bold links. No `## References`. |
| Fundamentals | `fundamentals.md` | Core concepts as `##` subheadings. |
| Practical Snippets | `snippets.md` | Language-tagged fenced code blocks. |
| Case Study | `case-study.md` | Situation / problems / solutions. |
| Materials | `materials.md` | Tools, community, reads. |

There is **no per-role glossary page** — see [Glossary](#glossary). AE intentionally runs deeper than the template (six content pages); don't flatten it.

## Workflow commands

```bash
uv sync --dev                    # install deps
uv run zensical serve            # local preview at localhost:8000
uv run zensical build --clean    # build to site/
```

After any content change, run `uv run zensical build --clean`. Zero issues = ship. Any warning ("unresolved link reference", missing nav target, etc.) must be fixed before commit.

## Editing rules

1. **Use the existing structure.** The five role tabs are the structure — don't add top-level tabs without asking. To add a sub-page, also update `nav` in `zensical.toml`.
2. **Every new page ends with `## References`** linking authoritative sources (official docs > peer-reviewed > textbooks > reputable blogs > random Medium posts). No bare URLs in body — use `[text](url)`.
3. **No Obsidian wikilinks** (`[[Page]]`, `![[file.png]]`). Replace with real markdown links or inline content. Reference doc was written for Obsidian; this isn't.
4. **No image embeds without source files.** If the original referenced `![[Screenshot.png]]`, either drop it or replace with a description + link to the source paper / docs.
5. **Code blocks** specify language: ` ```python `, ` ```sql `, ` ```bash `. Triple-backticks with no language are fine for plain text.
6. **Tables** are preferred over long bullet lists for comparisons.
7. **Math** uses `$...$` (inline) and `$$...$$` (block) — `pymdownx.arithmatex` is enabled.
8. **Mermaid diagrams** are enabled — use ` ```mermaid ` fences.
9. **Admonitions** (`!!! note`, `!!! warning`, `??? note` for collapsible) — use sparingly for callouts.
10. **No emojis** unless user asks. Lucide icons (`:material-...:`) are okay on the home/index pages.

## Heading hierarchy rules

Zensical (like MkDocs) uses the first `#` as the page title. Multiple `#` headings on one page break the table of contents sidebar.

1. **One `#` per page** — the page title only.
2. Major sections use `##`. Sub-sections use `###`. Sub-sub-sections use `####`.
3. **When demoting headings** (e.g., merging content from another page), cascade every child heading down one level too (`#` → `##`, `##` → `###`, `###` → `####`).
4. **Check bullet nesting after heading changes.** Indented code blocks and bullet lists that were children of the old heading level may lose their nesting. Verify that `- **Bold label**` items still have their sub-bullets indented with 4 spaces.
5. **Never indent headings or code fences** with leading spaces — they render as inline text or code blocks inside the preceding list.

## Glossary

**One glossary for the whole site**: `docs/glossary.md`, surfaced under the **Resources** tab. Role tabs do *not* have their own glossary pages — they were removed deliberately. Never recreate `docs/<role>/glossary.md`.

Structure: one `#` title, then one `##` heading per letter, each holding a single two-column table.

```markdown
## D

| Term | Meaning |
|------|---------|
| **DAG** | Directed acyclic graph; dbt/Airflow dependency structure |
```

### When the user wants to add a term

1. **Check for duplicates first.** `grep -in "term" docs/glossary.md`. If it's already there, refine that row — don't add a second.
2. **File under the term's first letter**, and insert the row **alphabetically inside that table** — not appended at the end.
3. **Create the letter section if missing.** Not every letter exists (currently no `J`, `Q`, `W`, `Y`, `Z`). Add the `##` heading in alphabetical position with the same two-line table header.
4. **Bold the term, plain-text the meaning**: `| **Term** | Meaning |`. No trailing period.
5. **Keep it role-agnostic.** DBA, DE, AE, and DA terms share one table. Don't tag, group, or split by role.
6. **One-liners only.** If a term needs a paragraph, it belongs on a content page — link it from there and keep the glossary row terse.
7. **Acronyms get expanded, not explained**: `| **ARPU** | Average Revenue Per User |`.

Math renders inside the table (`$P(A|B) = P(B|A) P(A) / P(B)$`) — arithmatex is enabled. A few existing rows sit slightly out of alphabetical order (e.g. `ANOVA` before `ANCOVA`); leave them alone — place new rows correctly, but don't mass-reorder existing ones.

## Formatting raw pasted content

The user often pastes raw unformatted text (from notes, ChatGPT, or copy-paste from web). Follow this process:

1. **Detect concatenated tables.** If a line contains column values smashed together (e.g., `TermOrigin wordOriginal meaning...`), parse it into a proper markdown table with `|` delimiters.
2. **Detect missing headings.** If a line is a standalone phrase followed by content, convert it to the appropriate heading level (`##`, `###`).
3. **Convert indented text to bullets.** Lines starting with spaces and no `-` should become `- ` bullet points.
4. **Remove filler prose.** Drop generic conclusion paragraphs and transition sentences like "This ensures..." or "In conclusion..." unless the user explicitly wants them.
5. **Preserve the user's structure.** Keep numbered items in the same order. Don't merge or reorder sections unless asked.
6. **Use italics for foreign terms** (e.g., Latin *factum*, Greek *skhēma*).
7. **Use backticks for code references** (e.g., `pd.DataFrame`, `data.frame`, `COUNT(*)`).

## Style

- Crisp prose. Tables and bullets > paragraphs.
- Each page opens with one sentence stating what the page is.
- "Why" matters. Don't just list functions — say when to use them.
- Dates are absolute (`2026-03-15`), not relative.
- Cite primary sources, not summaries of summaries.

## When asked to add content

1. **Pick the role tab first, then the page.** Index/partition note → `dba/fundamentals.md`. Pipeline pattern → `de/fundamentals.md`. dbt model → `analytics-engineering/dbt.md`. SQL function → `docs/sql/` or `resources/sql-cheatsheet.md`. New term → `docs/glossary.md`. Don't create unnecessary pages.
2. **Match neighbor style.** Open the surrounding page and mirror its tone, depth, and section headings.
3. **Verify with build.** Always run `uv run zensical build --clean` and ensure "No issues found".
4. **Update `docs/glossary.md`** if you introduce a new term — the single unified glossary, per the rules above.
5. **Adding a page to a role tab** means updating three things: the file, the `## Pages` list in that role's `index.md`, and `nav` in `zensical.toml`.

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
- Don't edit content when the user says "DO NOT EDIT THE CONTENT" — only fix structure (headings, indentation, nesting).
- Don't create multiple `#` (H1) headings on a single page — this breaks the TOC.
- Don't recreate per-role glossary pages. The glossary is unified at `docs/glossary.md` under Resources.
- Don't touch `site_url`, `repo_url`, or `repo_name` — TDB is a display name; the repo and its published URL stay `DAB`. (`pyproject.toml`'s `name` is deliberately `TDB` — it's a virtual package, nothing publishes or imports it. Leave it.)
- Don't move the DA folders into a `docs/da/` directory — they're re-nested by `nav` only, and moving them breaks every published URL.
- Don't author new prose for role content. Port the owner's own bible notes and lay out structure; leave a `<!-- TODO -->` where notes are missing.

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

The `wiki-maintainer` skill at `.agents/skills/wiki-maintainer/SKILL.md` codifies this workflow. Invoke it when adding, editing, or refactoring docs.

`CLAUDE.md` and `AGENTS.md` are identical apart from the title, the "this file" line in the tree, and the skill path (`.agents/` vs `.claude/`). Edit one, apply the same change to the other.

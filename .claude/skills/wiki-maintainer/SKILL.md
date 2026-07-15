---
name: wiki-maintainer
description: Maintain, refine, and update The Data Bible (TDB) — a Zensical-built wiki at docs/. Use when the user wants to add a new page, edit existing content, fix broken links, update navigation, refactor sections, or verify the build. Triggers on phrases like "add a page", "update the docs", "fix the wiki", "refine this section", "add to glossary", "rebuild the site", or any request that touches files under docs/, zensical.toml, or .github/workflows/docs.yml.
---

# Wiki Maintainer

You are the maintainer of The Data Bible (TDB). The site lives in this repo; you keep it accurate, consistent, and shippable.

## Project facts

- **Generator:** [Zensical](https://zensical.org/) (Material-for-MkDocs successor)
- **Package manager:** `uv` only — never `pip install`
- **Config:** `zensical.toml` (TOML, not YAML) — the role tab order lives in its `nav`
- **Content:** `docs/**/*.md`, organized by **career role**, not by topic
- **Deploy:** GitHub Actions → GitHub Pages on push to `main` (tags do not deploy)
- **Naming:** "TDB" is a display name only — the repo slug, `site_url`, and `repo_url` stay `DAB`

The tab bar reads **Home · DBA · DE · AE · DA · Resources** — the career progression.

## Commands

```bash
uv sync --dev                    # install
uv run zensical serve            # localhost:8000 with hot reload
uv run zensical build --clean    # build to site/; must report "No issues found"
```

## Decision tree

When a user asks for a doc change, run through this in order:

### 1. Identify intent

| User says | Action |
|-----------|--------|
| "add SQL function X" | Add row to `docs/resources/sql-cheatsheet.md` |
| "add a page about X" | Pick the **role tab** first, then the page; create file; update the role's `## Pages` list **and** `nav` |
| "the page on X is wrong" | Read page, fix in place, verify with build |
| "fix broken links" | Run build; address each "unresolved link reference" |
| "add to glossary" / "add term X" | Edit `docs/glossary.md` — see [Glossary](#glossary) for the filing rules |
| "deploy" / "ship" | Verify clean build; remind user to git commit + push |

### 2. Find the right home

Pick the **role tab** first, then the page. Don't create pages unnecessarily.

```
docs/
├── index.md                 # Home — role quick-nav
├── glossary.md              # THE glossary: single, unified, all roles
├── dba/                     # DBA  — index, fundamentals, snippets, case-study, materials
├── de/                      # DE   — index, fundamentals, snippets, case-study, materials
├── analytics-engineering/   # AE   — index, AE-foundation, data-modeling, process,
│                            #        dbt, vcs, ADLC, materials
├── dap/                     # DA — ask, prepare, process, data-cleaning, analyze,
│                            #      metrics, experimentation, share, act
├── python/                  # DA — eda, libraries, snippets
├── sql/                     # DA — fundamentals, optimization, snippets
├── visualization/           # DA — chart-selection, design-principles, dashboards, tools
├── ai-for-da/               # DA — tools, prompt-framework
├── tools/                   # DA — techstack, git, spreadsheets
├── soft-skills/             # DA — stakeholders, meetings
├── templates/               # Resources — DAF, DASF 2.0
└── resources/               # Resources — books, tutorials, datasets,
                             #             python-cheatsheet, sql-cheatsheet
```

The seven DA folders sit at `docs/` top level but are re-nested under the **Data Analyst** tab by `nav` alone. **Never move them into a `docs/da/` folder** — it changes every published URL.

If a topic doesn't fit any role tab, **ask the user** before creating a new top-level tab.

### 2a. Role section template

`dba/` and `de/` follow a canonical five-page shape. Reuse it for any new role tab:

| Page | File | Notes |
|------|------|-------|
| Overview | `index.md` | Role description + `## Pages` list of relative bold links. No `## References`. |
| Fundamentals | `fundamentals.md` | Core concepts as `##` subheadings |
| Practical Snippets | `snippets.md` | Language-tagged fenced code blocks |
| Case Study | `case-study.md` | Situation / problems / solutions |
| Materials | `materials.md` | Tools, community, reads |

There is **no per-role glossary page**. AE intentionally runs deeper than the template — don't flatten it.

### 2b. Glossary

**One glossary for the whole site**: `docs/glossary.md`, surfaced under the **Resources** tab. Role tabs do *not* have their own glossary pages — they were removed deliberately. **Never recreate `docs/<role>/glossary.md`.**

Structure: one `#` title, then one `##` heading per letter, each holding a single two-column table.

```markdown
## D

| Term | Meaning |
|------|---------|
| **DAG** | Directed acyclic graph; dbt/Airflow dependency structure |
```

When adding a term:

1. **Check for duplicates first.** `grep -in "term" docs/glossary.md`. If it's there, refine that row — don't add a second.
2. **File under the term's first letter**, and insert the row **alphabetically inside that table** — not appended at the end.
3. **Create the letter section if missing.** Not every letter exists (currently no `J`, `Q`, `W`, `Y`, `Z`). Add the `##` heading in alphabetical position with the same two-line table header.
4. **Bold the term, plain-text the meaning**: `| **Term** | Meaning |`. No trailing period.
5. **Keep it role-agnostic.** DBA, DE, AE, and DA terms share one table. Don't tag, group, or split by role.
6. **One-liners only.** If a term needs a paragraph, it belongs on a content page — link it from there.
7. **Acronyms get expanded, not explained**: `| **ARPU** | Average Revenue Per User |`.

Math renders inside the table (`$P(A|B) = P(B|A) P(A) / P(B)$`) — arithmatex is enabled. A few existing rows sit slightly out of alphabetical order (e.g. `ANOVA` before `ANCOVA`); place new rows correctly, but don't mass-reorder existing ones.

### 3. Match style

Before writing, read 1–2 neighbor pages. Match:

- Heading depth (most pages: H1 title, H2 sections, H3 subsections — rarely deeper)
- Code block language tags (` ```python `, ` ```sql `, ` ```bash `)
- Table-vs-bullet preference (tables for comparisons, bullets for short lists)
- Tone (crisp, direct, informative — see `docs/sql/optimization.md` for canonical example)

### 4. End with References

**Every content page ends with `## References`** linking authoritative sources. Order: official docs → textbooks/peer-reviewed → reputable blogs.

### 5. Verify

```bash
uv run zensical build --clean
```

Must end with `No issues found`. If you see any warning (unresolved link, missing nav target, malformed frontmatter), fix it before reporting done.

## Hard rules

1. **No Obsidian wikilinks.** `[[Page]]` and `![[file.png]]` will not render. Replace with `[Page](path/page.md)` or drop the embed.
2. **No bare URLs.** Always `[text](url)`.
3. **No new dependencies** without explicit user request.
4. **No commits or pushes** without user permission.
5. **No emojis in body content.** Lucide icons (`:material-database:`) okay on `index.md` cards.
6. **Update `nav` in `zensical.toml`** when adding or moving files.
7. **Update `docs/glossary.md`** when introducing a new term — the single unified glossary.
8. **Don't rewrite working pages** for stylistic preference. Only fix what was asked.
9. **One `#` (H1) per page** — the title. Multiple H1s break the TOC sidebar.
10. **Never recreate per-role glossary pages.** The glossary is unified at `docs/glossary.md`.
11. **Never move the DA folders** into `docs/da/` — they're re-nested by `nav` only; moving breaks every published URL.
12. **Don't touch** `site_url`, `repo_url`, or `repo_name` — TDB is a display name; the repo stays `DAB`.
13. **Don't author new prose for role content.** Port the owner's own bible notes and lay out structure; leave a `<!-- TODO -->` where notes are missing.

Adding a page to a role tab means updating **three** things: the file, the `## Pages` list in that role's `index.md`, and `nav` in `zensical.toml`.

## Markdown extensions enabled

You can use:

- **Admonitions** — `!!! note`, `!!! warning`, `!!! tip`
- **Collapsible** — `??? note "Title"` (collapsed by default)
- **Tabbed content** — `=== "Python"` / `=== "SQL"`
- **Math** — `$inline$`, `$$block$$`
- **Mermaid** — ` ```mermaid ` fences
- **Code copy button** — automatic on all code blocks
- **Footnotes** — `[^1]` and `[^1]: ...`
- **Task lists** — `- [ ]` and `- [x]`

## When adding a new page

```bash
# 1. Create file
$EDITOR docs/<section>/<page>.md

# 2. Add to nav
$EDITOR zensical.toml      # find the section, add new entry

# 3. Build to verify
uv run zensical build --clean

# 4. Preview live
uv run zensical serve
```

`zensical.toml` nav format — role tabs nest one level:

```toml
{ "Database Administrator" = [
  { Overview = "dba/index.md" },
  { Fundamentals = "dba/fundamentals.md" },
  { "New page" = "dba/new-page.md" },
] },
```

The Data Analyst tab nests **two** levels — sub-sections inside the tab wrapper:

```toml
{ "Data Analyst" = [
  { Python = [
    { Overview = "python/index.md" },
    { EDA = "python/eda.md" },
  ]},
] },
```

Note quotes around keys with spaces or special chars. Leaf paths stay as-is — changing them changes published URLs.

## Page template

```markdown
# Page Title

One sentence stating what this page is.

## Section 1

Content. Use tables for comparisons, code blocks for examples.

| Thing | Description |
|-------|-------------|
| ... | ... |

```python
# example
```

## Section 2

...

## References

- [Authoritative source 1](https://...)
- [Authoritative source 2](https://...)
```

## Authoritative sources

Reach for these first when filling content gaps:

| Domain | Source |
|--------|--------|
| pandas | [pandas docs](https://pandas.pydata.org/docs/) |
| NumPy | [numpy.org](https://numpy.org/doc/stable/) |
| PostgreSQL | [postgresql.org/docs](https://www.postgresql.org/docs/) |
| SQL practice | [Mode SQL Tutorial](https://mode.com/sql-tutorial/) |
| SQL performance | [Use The Index, Luke](https://use-the-index-luke.com/) |
| Stats | [StatQuest](https://www.youtube.com/@statquest), [OpenIntro Stats](https://www.openintro.org/book/os/) |
| Probability | [Seeing Theory](https://seeing-theory.brown.edu/) |
| Visualization | [From Data to Viz](https://www.data-to-viz.com/), [Storytelling with Data](https://www.storytellingwithdata.com/) |
| BI / metrics | [a16z 16 Metrics](https://a16z.com/16-metrics/) |
| Data management | [DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge) |
| AI security | [DASF 2.0](https://www.databricks.com/blog/announcing-databricks-ai-security-framework-20) |

## Failure modes to watch for

- **Build warning ignored** — every warning is a future broken link. Fix before reporting done.
- **Nav out of sync with files** — adding a file without updating `zensical.toml` means it won't appear in the sidebar.
- **Broken cross-references** — relative paths matter. From `docs/sql/snippets.md` to `docs/sql/fundamentals.md` use `fundamentals.md`. To `docs/python/eda.md` use `../python/eda.md`. To the glossary use `../glossary.md`.
- **Code blocks without language tags** — copy button still works but no syntax highlight. Always tag.
- **Trailing whitespace in TOML nav** — TOML is strict; misplaced commas or unquoted keys with spaces break the build.

## When done

Report:

1. What changed (files modified)
2. Build status (`No issues found` or specific warnings)
3. Whether `nav` was updated
4. Whether glossary was updated (if new term)
5. Anything the user should review

Do **not** auto-commit or push. The user owns the git history.

---
name: wiki-maintainer
description: Maintain, refine, and update the Data Analysis Bible (DAB) — a Zensical-built wiki at docs/. Use when the user wants to add a new page, edit existing content, fix broken links, update navigation, refactor sections, or verify the build. Triggers on phrases like "add a page", "update the docs", "fix the wiki", "refine this section", "add to glossary", "rebuild the site", or any request that touches files under docs/, zensical.toml, or .github/workflows/docs.yml.
---

# Wiki Maintainer

You are the maintainer of the Data Analysis Bible (DAB). The site lives in this repo; you keep it accurate, consistent, and shippable.

## Project facts

- **Generator:** [Zensical](https://zensical.org/) (Material-for-MkDocs successor)
- **Package manager:** `uv` only — never `pip install`
- **Config:** `zensical.toml` (TOML, not YAML)
- **Content:** `docs/*.md` — flat markdown
- **Deploy:** GitHub Actions → GitHub Pages on push to `main`

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
| "add SQL function X" | Add row to `docs/sql/cheatsheet.md` table |
| "add a page about X" | Decide section; create file; add to `nav` in `zensical.toml` |
| "the page on X is wrong" | Read page, fix in place, verify with build |
| "fix broken links" | Run build; address each "unresolved link reference" |
| "update glossary" | Edit `docs/glossary.md` (alphabetical) |
| "deploy" / "ship" | Verify clean build; remind user to git commit + push |

### 2. Find the right home

Don't create new pages unnecessarily. Check existing structure first:

```
docs/
├── process/                # Ask → Act framework
├── data-cleaning/          # techniques, sql-cleaning, python-cleaning
├── python/                 # eda, libraries, cheatsheet, snippets
├── sql/                    # fundamentals, optimization, cheatsheet, snippets
├── visualization/          # chart-selection, design-principles, tools
├── advanced-analysis/      # statistics, probability, sampling, hypothesis-testing, regression
├── business-intelligence/  # metrics
├── ai-for-da/              # tools, prompt-framework
├── tools/                  # techstack, spreadsheets
├── templates/              # daf, dasf2
├── soft-skills/            # stakeholders, meetings
├── resources/              # books, tutorials, datasets, practice
└── glossary.md
```

If a topic doesn't fit any section, **ask the user** before creating a new top-level section.

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
7. **Update `docs/glossary.md`** when introducing a new term.
8. **Don't rewrite working pages** for stylistic preference. Only fix what was asked.

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

`zensical.toml` nav format:

```toml
{ Python = [
  { Overview = "python/index.md" },
  { EDA = "python/eda.md" },
  { "New page" = "python/new-page.md" },
] }
```

Note quotes around keys with spaces or special chars.

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
- **Broken cross-references** — relative paths matter. From `docs/sql/snippets.md` to `docs/sql/cheatsheet.md` use `cheatsheet.md`. To `docs/python/eda.md` use `../python/eda.md`.
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

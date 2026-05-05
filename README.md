# Data Analysis Bible (DAB)

A searchable wiki for data analysis. Built with [Zensical](https://zensical.org/), deployed to GitHub Pages.

> Live site: <https://jack2000-dev.github.io/DAB/>

## Topics

DAP (Data Analysis Process) · Python · SQL · Visualization · AI for DA · Templates (SOW, DAF, DASF 2.0) · Soft Skills · Glossary

## Local development

Requires [`uv`](https://docs.astral.sh/uv/).

```bash
uv sync --dev
uv run zensical serve            # http://localhost:8000
uv run zensical build --clean    # output to site/
```

## Deploy

Push to `main` triggers `.github/workflows/docs.yml` which builds and deploys to GitHub Pages.

Enable Pages once: **Settings → Pages → Source: GitHub Actions**.

## Maintenance

This repo is self-maintaining via `CLAUDE.md` and the `wiki-maintainer` skill at `.claude/skills/wiki-maintainer/SKILL.md`. Open with Claude Code, ask it to add or update content; it follows the maintainer rules and verifies the build.

## License

MIT — see [LICENSE](LICENSE).

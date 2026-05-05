# AI for Data Analysis

LLMs and AI tools accelerate analysis but don't replace judgment.

!!! warning "Always validate"
    Always **validate** data and results from AI. Do **NOT** feed confidential or sensitive data to a non-local LLM. Treat output as a draft, not a decision.

## Pages

- **[Tools](tools.md)** — JuliusAI, Claude, Genie, Data Cards
- **[Prompt Framework](prompt-framework.md)** — task → context → references → evaluate → iterate

## What AI is good for

- **Data cleaning** — generate code to remove nulls, normalize, deduplicate
- **Data organizing** — pivot, melt, group via natural language
- **Documentation** — turn code into prose; explain queries
- **Reporting** — summarize findings into stakeholder-ready text
- **Debugging** — Python/R/SQL error explanation
- **Code generation** — boilerplate, transformations, joins
- **Synthetic data** — mock samples for testing

## What AI is bad for

- Domain-specific judgment
- Sensitive data outside controlled environments
- Final decisions
- Anything where you can't verify the answer

## Privacy and safety

- Never paste real PII, financial data, or proprietary code into public LLMs
- Use enterprise tiers with data agreements
- Prefer local models (Ollama, llama.cpp) for sensitive work
- Redact before sending — replace names, IDs, emails

## References

- [Anthropic — Claude](https://claude.ai/)
- [OpenAI — ChatGPT for Data](https://chat.openai.com/)
- [Google — Data Cards Playbook](https://sites.research.google/datacardsplaybook/)
- [Databricks — DASF 2.0](https://www.databricks.com/blog/announcing-databricks-ai-security-framework-20)
- [Ollama — local LLMs](https://ollama.com/)

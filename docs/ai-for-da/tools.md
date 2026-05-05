# AI Tools for DA

## Code-aware AI

| Tool | Best for |
|------|----------|
| [Claude](https://claude.ai/) | Long context, code analysis, careful reasoning |
| [ChatGPT](https://chat.openai.com/) | General purpose, plugin ecosystem |
| [GitHub Copilot](https://github.com/features/copilot) | In-IDE code completion |
| [Cursor](https://cursor.sh/) | AI-first editor, multi-file edits |
| [Claude Code](https://claude.com/claude-code) | Terminal/CLI agent, full repo context |

## Data-specific AI

| Tool | Description |
|------|-------------|
| [Julius AI](https://julius.ai/) | Upload CSV → natural language analysis + viz |
| [Hex Magic](https://hex.tech/product/magic-ai/) | AI inside notebook environment |
| [Mode AI Helper](https://mode.com/) | SQL and Python assist |
| [Databricks Genie](https://www.databricks.com/product/genie-code) | NL → SQL on lakehouse |
| [Snowflake Cortex](https://www.snowflake.com/en/data-cloud/cortex/) | LLM functions in SQL |
| [BigQuery — Data Canvas](https://cloud.google.com/bigquery/) | NL data exploration |

## Local LLMs

For sensitive data:

- [Ollama](https://ollama.com/) — easiest local LLM runner
- [llama.cpp](https://github.com/ggerganov/llama.cpp) — efficient C++ inference
- [LM Studio](https://lmstudio.ai/) — desktop app
- [GPT4All](https://gpt4all.io/)

## Data Cards

[Google — Data Cards Playbook](https://sites.research.google/datacardsplaybook/) — framework for transparent, structured documentation of datasets used in ML.

## DASF 2.0

[Databricks AI Security Framework 2.0](https://www.databricks.com/blog/announcing-databricks-ai-security-framework-20) — security framework for AI systems. See [Templates → DASF 2.0](../templates/dasf2.md) for summary.

## Choose by task

| Task | Recommended tool |
|------|------------------|
| Quick CSV exploration | Julius AI, ChatGPT (Code Interpreter) |
| Codebase-aware refactor | Claude Code, Cursor |
| In-IDE autocomplete | Copilot |
| NL → SQL | Genie, Cortex, custom GPT |
| Sensitive on-prem | Ollama + Llama 3.1 |
| Long-context document analysis | Claude (200K context) |

## References

- [Anthropic docs](https://docs.claude.com/)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [LangChain — chains and agents](https://python.langchain.com/)
- [LlamaIndex — retrieval](https://docs.llamaindex.ai/)

# AI/DA Prompt Framework

The five-step framework: **Task → Context → References → Evaluate → Iterate.**

## 1. Task

Describe with specificity and format preference.

- What you want
- The output format (table, code, prose, JSON)
- Length (one paragraph, 3 bullets, no longer than X)

> Bad: "Help with my data."  
> Good: "Write a Python function that takes a DataFrame, removes outliers using IQR (1.5×) on the `price` column, and returns the cleaned DataFrame plus a count of removed rows."

## 2. Context

Include relevant context.

- The dataset shape, types, sample rows
- Business goal
- Constraints (must run on Python 3.13, must use pandas, must complete in < 5s)
- Audience (technical / non-technical)

> "Dataset: 50,000 e-commerce orders with columns `order_id, user_id, total, status, created_at`. Goal: identify top 10 customers by lifetime value. Output: SQL for PostgreSQL 16."

## 3. References

Something the AI can use to inform its output.

- Example output ("here's similar code we use elsewhere")
- API docs ("here's the relevant pandas method signature")
- Schema ("here's the table DDL")
- Style guide ("we use snake_case, no abbreviations")

## 4. Evaluate

Ask for opportunities for improvement.

- "What edge cases did you miss?"
- "How would this fail with NULL values?"
- "What's the time complexity? Can it be faster?"
- "Are there alternative approaches I should consider?"

## 5. Iterate

Refine based on the evaluation.

- Apply fixes
- Re-prompt with clarifications
- Don't accept the first answer if it's not clear or correct

## Full example

```text
TASK
Write a SQL query (PostgreSQL 16) that returns the top 10 customers by
lifetime value (total revenue across all orders). Include customer name and
country. Format as a single CTE-based query.

CONTEXT
Tables:
  customers (id PK, name, country, created_at)
  orders    (id PK, customer_id FK, total NUMERIC, status, created_at)
Only count orders where status = 'paid'. Active customer = at least 1 order
in the last 365 days.

REFERENCES
Style: lowercase keywords, snake_case, comma-leading on long lists.
Match existing query: SELECT c.id, c.name FROM customers c WHERE ...

EVALUATE
After your draft:
  1. What happens if a customer has no orders? Are they excluded?
  2. Does this handle currency mixing? (Assume USD only for now.)
  3. Performance — would this benefit from indexes?
```

## Tips

- **Be specific about formats** — "as Markdown table" / "as JSON with keys X, Y"
- **Show, don't tell** — give examples of input/output
- **Constrain output** — "no longer than 5 lines" prevents rambling
- **Use roles** — "Act as a senior data analyst reviewing this SQL"
- **Chain prompts** — break complex tasks into steps; let the AI plan first
- **Cache schema** — paste once at the start, refer back

## References

- [Anthropic — Prompt engineering](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)
- [OpenAI — Prompt engineering guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Brex — Prompt engineering guide](https://github.com/brexhq/prompt-engineering)
- [Wharton — Prompt patterns](https://www.aiprompt.io/)

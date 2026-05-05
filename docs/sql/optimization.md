# SQL Optimization

How to write SQL that doesn't melt the database.

## Safety checklist (production)

| Technique | Purpose |
|-----------|---------|
| `EXPLAIN ANALYZE` | Show plan + actual timing (use with caution on huge tables) |
| **Dry run** | Run on staging or dev DB with smaller subset first |
| **Count first** | `SELECT COUNT(*) WHERE ...` to see how many rows you'll touch |
| **Batching** | Update in batches of 5,000 to avoid locking |
| **Check execution plan** | Look for missing indexes or Cartesian products |

## 1. Predict the outcome (without running)

You can't know exact values without running, but you can predict **structure** and **scale**.

### `EXPLAIN`

Every major DB has `EXPLAIN`. It shows the **execution plan** — the database's intended approach.

- **Cost** — arbitrary number representing effort
- **Rows** — estimated rows scanned/returned
- **Width** — estimated bytes per row

```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 42;

EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
-- ANALYZE actually runs the query — careful on writes/big tables
```

### Mental mapping (before hitting Run)

1. **Grain** — `GROUP BY customer_id` with 5,000 customers = 5,000 rows
2. **Filter** — `WHERE date > '2026-01-01'` covers ~10% → 100,000 rows from 1M
3. **Join multiplier** — customer joined to orders (50 each) = 50× row blow-up

## 2. Selectivity — only what you need

### Avoid `SELECT *`

```sql
-- Bad
SELECT * FROM orders WHERE user_id = 42;

-- Good
SELECT id, total, created_at FROM orders WHERE user_id = 42;
```

Wastes memory and I/O on unused columns.

### Use `LIMIT` when testing

```sql
SELECT * FROM huge_table LIMIT 10;
```

Stops after 10 matches.

## 3. Filter and index

### Filter early

Put the most restrictive `WHERE` clause first.

### Sargable queries

Avoid functions on indexed columns in `WHERE`.

```sql
-- Bad — DB must compute YEAR for every row
WHERE YEAR(transaction_date) = 2026

-- Good — DB uses index directly
WHERE transaction_date >= '2026-01-01'
  AND transaction_date <  '2027-01-01'
```

```sql
-- Bad
WHERE LOWER(email) = 'jack@example.com'

-- Good (if you have functional index OR canonicalize on insert)
WHERE email = 'jack@example.com'
```

### Index appropriately

- B-tree: equality + range
- Hash: equality only (Postgres)
- GIN: full-text, JSONB
- Partial index: `WHERE status = 'active'` if hot

```sql
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_created ON orders (created_at);
CREATE INDEX idx_orders_active  ON orders (user_id) WHERE status = 'active';
```

## 4. Joins

- **Join on indexed columns** — usually PK ↔ FK
- **Filter before joining** — use a CTE/subquery to shrink the table first

```sql
-- Bad — joins full tables, then filters
SELECT * FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE c.country = 'US' AND o.created_at >= '2026-01-01';

-- Good — narrow each side first
WITH us_customers AS (
  SELECT id FROM customers WHERE country = 'US'
), recent AS (
  SELECT * FROM orders WHERE created_at >= '2026-01-01'
)
SELECT * FROM us_customers c JOIN recent o ON o.customer_id = c.id;
```

## 5. Batching writes

```sql
-- Update 5k at a time to avoid locking 1M rows
UPDATE orders
SET status = 'archived'
WHERE id IN (
  SELECT id FROM orders WHERE created_at < '2025-01-01' LIMIT 5000
);
-- Loop in your app/script until 0 rows affected
```

## Common anti-patterns

| Anti-pattern | Fix |
|--------------|-----|
| `SELECT *` | Pick columns |
| `WHERE func(col) = ...` | Rewrite to be sargable |
| `OR` across columns | Often blocks index; try `UNION` |
| Implicit cast (`int_col = '42'`) | Match types |
| Cartesian join (missing `ON`) | Add join condition |
| `NOT IN` with NULLs | Use `NOT EXISTS` |
| Large `IN (...)` lists | Use `JOIN` against a temp table |

## References

- [PostgreSQL — Performance Tips](https://www.postgresql.org/docs/current/performance-tips.html)
- [Use The Index, Luke](https://use-the-index-luke.com/)
- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)
- [pganalyze — EXPLAIN visualizer](https://explain.dalibo.com/)

# SQL Optimization

How to write SQL that doesn't melt the database.

## Common rewrites

Toggle through the patterns below — each shows a slow query and the faster equivalent.

<div class="sx-explorer" data-variant="select_star" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="select_star"      aria-pressed="true">SELECT *</button>
    <button class="sx-btn" data-variant="sargable_date"    aria-pressed="false">sargable date</button>
    <button class="sx-btn" data-variant="sargable_lower"   aria-pressed="false">sargable case</button>
    <button class="sx-btn" data-variant="filter_then_join" aria-pressed="false">filter before join</button>
    <button class="sx-btn" data-variant="or_to_union"      aria-pressed="false">OR → UNION</button>
    <button class="sx-btn" data-variant="not_in_null"      aria-pressed="false">NOT IN → NOT EXISTS</button>
    <button class="sx-btn" data-variant="implicit_cast"    aria-pressed="false">implicit cast</button>
    <button class="sx-btn" data-variant="large_in"         aria-pressed="false">large IN list</button>
  </div>
  <div class="sx-stage">
    <div class="sx-stage-grid">
      <div>
        <div class="sx-sublabel">Slow</div>
        <div data-stage="before"></div>
      </div>
      <div>
        <div class="sx-sublabel">Fast</div>
        <div data-stage="after"></div>
      </div>
    </div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'select_star',
  variants: {
    select_star: { name:'Avoid SELECT *', level:'beginner',
      tag:'projection · ship only what you need',
      desc:'<code>SELECT *</code> reads every column from disk and ships them across the wire. Pick the columns you actually use — saves I/O, RAM, and network.',
      stages:{
        before:{ kind:'bad',  code:'-- reads every column on disk\nSELECT *\nFROM   orders\nWHERE  user_id = 42;' },
        after: { kind:'good', code:'-- only what the consumer needs\nSELECT id, total, created_at\nFROM   orders\nWHERE  user_id = 42;' }
      }
    },
    sargable_date: { name:'Sargable date filter', level:'intermediate',
      tag:'don\'t wrap indexed columns in functions',
      desc:'A function on the column (<code>YEAR(col)</code>, <code>DATE(col)</code>) forces a full scan — the index on the raw column is useless. Rewrite as a half-open range so the planner can use it.',
      stages:{
        before:{ kind:'bad',  code:'-- function on indexed col → full scan\nSELECT *\nFROM   orders\nWHERE  YEAR(created_at) = 2026;' },
        after: { kind:'good', code:'-- range scan uses the index\nSELECT *\nFROM   orders\nWHERE  created_at >= \'2026-01-01\'\n  AND  created_at <  \'2027-01-01\';' }
      }
    },
    sargable_lower: { name:'Case-insensitive lookup', level:'intermediate',
      tag:'normalize on write, not on read',
      desc:'<code>LOWER(email) = ...</code> blocks the index. Either canonicalize the value on insert/update, or build a functional index on <code>LOWER(email)</code>.',
      stages:{
        before:{ kind:'bad',  code:'-- LOWER blocks the regular index\nSELECT *\nFROM   users\nWHERE  LOWER(email) = \'jack@example.com\';' },
        after: { kind:'good', code:'-- emails stored lower-cased on insert\nSELECT *\nFROM   users\nWHERE  email = \'jack@example.com\';\n\n-- or:\nCREATE INDEX idx_users_email_lower\n  ON users (LOWER(email));' }
      }
    },
    filter_then_join: { name:'Filter before joining', level:'intermediate',
      tag:'shrink each side first',
      desc:'Joining two big tables and then filtering forces the engine to pair every row before throwing most away. Filter each side first via a CTE/subquery so the join works on a fraction of the data.',
      stages:{
        before:{ kind:'bad',  code:'-- joins full tables, then filters\nSELECT *\nFROM   users u\nJOIN   orders o ON o.user_id = u.id\nWHERE  u.country = \'US\'\n  AND  o.created_at >= \'2026-01-01\';' },
        after: { kind:'good', code:'-- narrow each side first\nWITH us_users AS (\n  SELECT id FROM users WHERE country = \'US\'\n), recent AS (\n  SELECT * FROM orders WHERE created_at >= \'2026-01-01\'\n)\nSELECT *\nFROM   us_users u\nJOIN   recent  o ON o.user_id = u.id;' }
      }
    },
    or_to_union: { name:'OR across columns → UNION', level:'advanced',
      tag:'OR often blocks index use',
      desc:'<code>OR</code> across <em>different</em> indexed columns usually defeats both indexes. Splitting into two index-friendly queries with <code>UNION</code> is often dramatically faster.',
      stages:{
        before:{ kind:'bad',  code:'-- planner can\'t use both indexes\nSELECT *\nFROM   users\nWHERE  email = \'jack@x.com\'\n   OR  phone = \'555-1234\';' },
        after: { kind:'good', code:'-- each branch hits its own index\nSELECT * FROM users WHERE email = \'jack@x.com\'\nUNION\nSELECT * FROM users WHERE phone = \'555-1234\';' }
      }
    },
    not_in_null: { name:'NOT IN with NULLs', level:'advanced',
      tag:'NOT IN + a NULL in the list returns nothing',
      desc:'If the subquery returns even one <code>NULL</code>, <code>NOT IN</code> evaluates to <em>unknown</em> for every row → empty result. Use <code>NOT EXISTS</code> (or filter NULLs out) for safety <em>and</em> usually better plans.',
      stages:{
        before:{ kind:'bad',  code:'-- if any leads.email is NULL, this returns 0 rows\nSELECT *\nFROM   users u\nWHERE  u.email NOT IN (SELECT email FROM leads);' },
        after: { kind:'good', code:'-- NULL-safe and usually better optimised\nSELECT *\nFROM   users u\nWHERE  NOT EXISTS (\n  SELECT 1 FROM leads l WHERE l.email = u.email\n);' }
      }
    },
    implicit_cast: { name:'Implicit type cast', level:'intermediate',
      tag:'mismatched types disable the index',
      desc:'Comparing an <code>int</code> column to a <code>text</code> literal forces the engine to cast every row before comparing — the index gets skipped. Match types in your code or fix the schema.',
      stages:{
        before:{ kind:'bad',  code:'-- string literal → cast every row\nSELECT *\nFROM   orders\nWHERE  user_id = \'42\';' },
        after: { kind:'good', code:'-- type-matched, index used\nSELECT *\nFROM   orders\nWHERE  user_id = 42;' }
      }
    },
    large_in: { name:'Large IN (...) list', level:'intermediate',
      tag:'thousands of literals strain the planner',
      desc:'A few dozen values in <code>IN (...)</code> is fine. Thousands chokes the planner and bloats the query string. Stage the values in a temp table or CTE and join.',
      stages:{
        before:{ kind:'bad',  code:'SELECT *\nFROM   orders\nWHERE  user_id IN (1,2,3, /* … 5,000 more … */ 9999);' },
        after: { kind:'good', code:'-- stage the ids, then join\nWITH wanted (user_id) AS (\n  VALUES (1),(2),(3) /* … */\n)\nSELECT o.*\nFROM   orders o\nJOIN   wanted w ON w.user_id = o.user_id;' }
      }
    }
  }
});
</script>


## Safety checklist (production)

```markdown
- [ ] `EXPLAIN ANALYZE` — show plan + actual timing (careful on huge tables)
- [ ] **Dry run** — run on staging / dev DB with a smaller subset first
- [ ] **Count first** — `SELECT COUNT(*) WHERE ...` to see how many rows you'll touch
- [ ] **Batching** — update in batches of 5,000 to avoid locking
- [ ] **Check execution plan** — look for missing indexes or Cartesian products
```

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

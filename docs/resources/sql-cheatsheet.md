# SQL Cheatsheet

## Sources
- [SQL Cheat Sheets](https://learnsql.com/tags/cheat-sheet/)
- [SQL Cookboook](https://learnsql.com/cookbook/)

## Frequently used functions (cleaning + transformation)

| Function | Use |
|----------|-----|
| `INSERT INTO ...` | Add rows |
| `UPDATE ... SET` | Modify rows |
| `DELETE FROM ...` | Remove rows |
| `DISTINCT` | Dedupe in `SELECT` |
| `LENGTH(s)` | String length |
| `SUBSTR(s, start, len)` | Substring |
| `TRIM(s)` | Strip whitespace |
| `CAST(x AS type)` | Type conversion |
| `CONCAT(a, b)` | String concat |
| `COALESCE(a, b, ...)` | First non-null |
| `NULLIF(a, b)` | NULL if equal |
| `LOWER(s) / UPPER(s)` | Case |
| `REPLACE(s, from, to)` | Substitute substring |
| `POSITION(sub IN s)` | Index of substring |
| `LEFT(s, n) / RIGHT(s, n)` | First/last n chars |

## Aggregation

| Function | Use |
|----------|-----|
| `COUNT(*) / COUNT(DISTINCT col)` | Row / unique count |
| `SUM(col)` | Total |
| `AVG(col)` | Mean |
| `MIN(col) / MAX(col)` | Extremes |
| `STRING_AGG(col, ', ')` (Postgres) | Concatenate group values |
| `ARRAY_AGG(col)` | Aggregate to array |
| `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY col)` | Median |

## Window functions

| Function | Use |
|----------|-----|
| `ROW_NUMBER() OVER (...)` | Unique sequential rank |
| `RANK() OVER (...)` | Rank with gaps |
| `DENSE_RANK() OVER (...)` | Rank no gaps |
| `LAG(col, n) OVER (...)` | Value n rows before |
| `LEAD(col, n) OVER (...)` | Value n rows after |
| `SUM(col) OVER (ORDER BY ...)` | Running total |
| `AVG(col) OVER (ROWS BETWEEN ...)` | Rolling average |
| `FIRST_VALUE / LAST_VALUE` | First/last in window |
| `NTILE(n)` | Bucket rows into n quantiles |

## Date functions (Postgres)

| Function | Use |
|----------|-----|
| `NOW()` / `CURRENT_TIMESTAMP` | Current timestamp |
| `CURRENT_DATE` | Today |
| `DATE_TRUNC('month', d)` | Floor to month/day/etc. |
| `EXTRACT(YEAR FROM d)` | Date part |
| `AGE(a, b)` | Difference |
| `d + INTERVAL '7 days'` | Date math |
| `TO_CHAR(d, 'YYYY-MM')` | Format string |
| `TO_DATE(s, 'YYYY-MM-DD')` | Parse date |

## Joins

| Join | Returns |
|------|---------|
| `INNER JOIN` | Matching rows in both |
| `LEFT JOIN` | All from left + match (or NULL) |
| `RIGHT JOIN` | All from right + match (or NULL) |
| `FULL OUTER JOIN` | All from both |
| `CROSS JOIN` | Cartesian product |
| `LATERAL` | Per-row subquery (Postgres) |

## Useful patterns

```sql
-- Top N per group
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) AS rn
  FROM orders
) t WHERE rn <= 3;

-- Running total
SUM(amount) OVER (PARTITION BY user_id ORDER BY date)

-- 7-day rolling average
AVG(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)

-- Pivot (Postgres)
SELECT
  month,
  SUM(CASE WHEN product='A' THEN units END) AS units_a,
  SUM(CASE WHEN product='B' THEN units END) AS units_b
FROM sales GROUP BY month;

-- Existence check (faster than COUNT)
SELECT EXISTS(SELECT 1 FROM users WHERE email = 'jack@x');

-- Anti-join
SELECT * FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = c.id);
```

## References

- [PostgreSQL — Functions](https://www.postgresql.org/docs/current/functions.html)

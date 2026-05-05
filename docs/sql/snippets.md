# SQL Snippets

## Cohort retention

```sql
WITH signups AS (
  SELECT user_id, DATE_TRUNC('month', created_at) AS cohort
  FROM users
),
activity AS (
  SELECT user_id, DATE_TRUNC('month', event_at) AS active_month
  FROM events
)
SELECT
  s.cohort,
  (EXTRACT(YEAR FROM AGE(a.active_month, s.cohort)) * 12
   + EXTRACT(MONTH FROM AGE(a.active_month, s.cohort)))::int AS month_index,
  COUNT(DISTINCT s.user_id) AS users
FROM signups s
JOIN activity a USING (user_id)
GROUP BY 1, 2
ORDER BY 1, 2;
```

## Funnel

```sql
WITH events_by_user AS (
  SELECT user_id,
         MAX(CASE WHEN event = 'visit'    THEN 1 ELSE 0 END) AS v,
         MAX(CASE WHEN event = 'signup'   THEN 1 ELSE 0 END) AS s,
         MAX(CASE WHEN event = 'purchase' THEN 1 ELSE 0 END) AS p
  FROM events GROUP BY user_id
)
SELECT
  SUM(v) AS visited,
  SUM(s) AS signed_up,
  SUM(p) AS purchased,
  ROUND(100.0 * SUM(s) / NULLIF(SUM(v),0), 2) AS visit_to_signup,
  ROUND(100.0 * SUM(p) / NULLIF(SUM(s),0), 2) AS signup_to_purchase
FROM events_by_user;
```

## Top N per group

```sql
SELECT *
FROM (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY country ORDER BY revenue DESC) AS rn
  FROM customers
) t
WHERE rn <= 5;
```

## Sessionize events (gap-based)

```sql
WITH numbered AS (
  SELECT
    user_id, event_at,
    LAG(event_at) OVER (PARTITION BY user_id ORDER BY event_at) AS prev
  FROM events
),
flagged AS (
  SELECT *,
    CASE WHEN prev IS NULL OR event_at - prev > INTERVAL '30 minutes'
         THEN 1 ELSE 0 END AS new_session
  FROM numbered
)
SELECT *,
  SUM(new_session) OVER (PARTITION BY user_id ORDER BY event_at) AS session_id
FROM flagged;
```

## Date spine (fill missing dates)

```sql
WITH days AS (
  SELECT generate_series(DATE '2026-01-01', DATE '2026-12-31', INTERVAL '1 day')::date AS d
)
SELECT d, COALESCE(SUM(amount), 0) AS revenue
FROM days
LEFT JOIN orders ON orders.created_at::date = days.d
GROUP BY d ORDER BY d;
```

## Median per group

```sql
SELECT country,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM employees
GROUP BY country;
```

## MoM growth

```sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', created_at) AS m, SUM(total) AS rev
  FROM orders GROUP BY 1
)
SELECT m, rev,
       LAG(rev) OVER (ORDER BY m) AS prev,
       ROUND(100.0 * (rev - LAG(rev) OVER (ORDER BY m))
                   / NULLIF(LAG(rev) OVER (ORDER BY m), 0), 2) AS mom_pct
FROM monthly ORDER BY m;
```

## Detect duplicates

```sql
SELECT email, COUNT(*) AS dupes
FROM users GROUP BY email HAVING COUNT(*) > 1;
```

## Pivot (CASE method)

```sql
SELECT
  user_id,
  SUM(CASE WHEN month='2026-01' THEN amount ELSE 0 END) AS jan,
  SUM(CASE WHEN month='2026-02' THEN amount ELSE 0 END) AS feb,
  SUM(CASE WHEN month='2026-03' THEN amount ELSE 0 END) AS mar
FROM monthly_revenue GROUP BY user_id;
```

## References

- [Modern SQL — examples](https://modern-sql.com/)
- [PostgreSQL — generate_series](https://www.postgresql.org/docs/current/functions-srf.html)
- [Mode — SQL analytics tutorial](https://mode.com/sql-tutorial/sql-business-analytics-training/)

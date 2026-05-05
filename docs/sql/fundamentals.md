# SQL Fundamentals

## SELECT basics

```sql
SELECT column1, column2 FROM table_name;
SELECT * FROM table_name LIMIT 10;
SELECT DISTINCT country FROM users;
```

## WHERE filters

```sql
SELECT * FROM orders
WHERE status = 'paid'
  AND total > 100
  AND created_at >= '2026-01-01';

-- Pattern matching
WHERE email LIKE '%@gmail.com'
WHERE name ILIKE 'john%'        -- case-insensitive (Postgres)

-- Lists
WHERE country IN ('US', 'CA', 'UK')
WHERE country NOT IN ('US')

-- Range
WHERE total BETWEEN 100 AND 500

-- NULLs
WHERE phone IS NULL
WHERE phone IS NOT NULL
```

## Aggregation

```sql
SELECT
  country,
  COUNT(*)              AS orders,
  COUNT(DISTINCT user_id) AS customers,
  SUM(total)            AS revenue,
  AVG(total)            AS avg_order,
  MIN(total)            AS min_order,
  MAX(total)            AS max_order
FROM orders
GROUP BY country
HAVING SUM(total) > 10000
ORDER BY revenue DESC;
```

## JOINs

```sql
-- INNER: only matching rows
SELECT u.name, o.total
FROM users u
JOIN orders o ON o.user_id = u.id;

-- LEFT: all from left, NULL where no match
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;

-- RIGHT: all from right (rarely used; flip to LEFT)

-- FULL OUTER: all rows from both
SELECT u.name, o.total
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.id;

-- CROSS: cartesian product
SELECT a.color, b.size FROM colors a CROSS JOIN sizes b;
```

## CASE expressions

```sql
SELECT
  user_id,
  CASE
    WHEN total > 1000 THEN 'whale'
    WHEN total >  100 THEN 'regular'
    ELSE                   'small'
  END AS segment
FROM orders;
```

## Subqueries and CTEs

```sql
-- Subquery
SELECT user_id, total
FROM orders
WHERE user_id IN (
  SELECT id FROM users WHERE country = 'US'
);

-- CTE — preferred for readability
WITH us_users AS (
  SELECT id FROM users WHERE country = 'US'
),
their_orders AS (
  SELECT * FROM orders WHERE user_id IN (SELECT id FROM us_users)
)
SELECT user_id, SUM(total) AS revenue
FROM their_orders
GROUP BY user_id;
```

## Window functions

```sql
-- Ranking
SELECT
  user_id, total,
  ROW_NUMBER()  OVER (PARTITION BY user_id ORDER BY total DESC) AS rn,
  RANK()        OVER (PARTITION BY user_id ORDER BY total DESC) AS rk,
  DENSE_RANK()  OVER (PARTITION BY user_id ORDER BY total DESC) AS drk
FROM orders;

-- Running total
SELECT
  date, revenue,
  SUM(revenue) OVER (ORDER BY date) AS running_total,
  AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS rolling_7d
FROM daily_revenue;

-- Period-over-period
SELECT
  month, revenue,
  LAG(revenue, 1)  OVER (ORDER BY month) AS prev_month,
  LEAD(revenue, 1) OVER (ORDER BY month) AS next_month
FROM monthly_revenue;
```

## Set operations

```sql
SELECT email FROM customers
UNION
SELECT email FROM leads;            -- distinct

SELECT email FROM customers
UNION ALL
SELECT email FROM leads;            -- keeps duplicates

SELECT email FROM customers
INTERSECT
SELECT email FROM leads;            -- in both

SELECT email FROM customers
EXCEPT
SELECT email FROM leads;            -- in customers but not leads
```

## Date functions (Postgres)

```sql
SELECT
  CURRENT_DATE,
  NOW(),
  DATE_TRUNC('month', created_at) AS month,
  EXTRACT(YEAR FROM created_at)   AS year,
  AGE(NOW(), created_at)          AS lifetime,
  created_at - INTERVAL '7 days'  AS week_ago
FROM users;
```

## References

- [PostgreSQL — Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Mode — SQL Tutorial](https://mode.com/sql-tutorial/)
- [SQLZoo](https://sqlzoo.net/)
- [Window Functions — PostgreSQL](https://www.postgresql.org/docs/current/tutorial-window.html)

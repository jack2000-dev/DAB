# Analytics Engineer Foundations

## What is Analytics Engineering?

It's bridge the gap between Data Engineer and Data Analyst

## ELT vs. ETL

### ETL (Extract, Transform, Load)

- Traditional approach to data integration, where data is extracted from a source system, transformed into a desired format, and then loaded into a destination system.
- Good for local, legacy, or small projects where the data volume is small and the transformation logic is simple.

### ELT (Extract, Load, Transform)

- Modern approach to data integration, where data is extracted from a source system, loaded into a destination system, and then transformed into a desired format.
- Good for cloud-based data warehouses and large-scale data integration.

### Best Practice

- Prefer ELT for modern architectures
- Maintain data lineage and validation
- Automate workflows with Airflow and dbt

## SQL for Analytics

See also: [SQL](../sql/index.md)

### CTEs (Common Table Expressions)

- CTEs simplify complex SQL using the `WITH` clause
- Improve query readability, modularity, and reusability

### Analytical Functions

- Extend SQL beyond basic aggregations
- Perform calculations across sets of rows
- Preserve row-level details

#### Common Analytical Functions

- **Ranking Functions**

| Function | Description |
|---|---|
| `ROW_NUMBER()` | Gives each row a unique number (1, 2, 3, ...) with no ties |
| `RANK()` | Gives each row a rank; rows with the same value share a rank and the next rank is skipped |
| `DENSE_RANK()` | Like `RANK()`, but does not skip ranks after a tie |

- **Aggregate Window Functions**

| Function | Description |
|---|---|
| `SUM() OVER()` | Calculates a running or grouped total across rows |
| `AVG() OVER()` | Calculates a running or grouped average across rows |

- **Time-based Comparison Functions**

| Function | Description |
|---|---|
| `LAG()` | Returns the value from a previous row (e.g., last month's sales) |
| `LEAD()` | Returns the value from a following row (e.g., next month's sales) |

- **Offset and Limiting Functions**

| Function | Description |
|---|---|
| `OFFSET` | Skips a specified number of rows before returning results |
| `FETCH` | Limits how many rows are returned after the offset |


#### Business Use Cases

- Ranking top-performing products
- Calculating running totals and moving averages
- Measure user retention and churn

#### Window Clause Components

- `PARTITION BY`: Defines groups
- `ORDER BY`: Controls calculation order
- `FRAME`: Defines row range for computation

#### Best Practices

- Use window functions for advanced analytics
- Combine with CTEs for clarity and modularity
- Optimize queries for performace and scalability

## PostgreSQL for Analytics

### Common Functions

- **String Functions**
  - `LOWER()`: Converts to lowercase
  - `UPPER()`: Converts to uppercase
  - `TRIM()`: Removes whitespace
  - `SUBSTRING()`: Extracts a substring
  - `LENGTH()`: Gets string length

- **Date/Time Functions**
  - `NOW()`: Returns current timestamp
  - `CURRENT_DATE`: Returns current date
  - `CURRENT_TIME`: Returns current time
  - `DATE_TRUNC()`: Truncates date/time to specified unit
  - `INTERVAL`: Creates time intervals

- **Conditional Functions**
  - `CASE`: Conditional logic
  - `COALESCE()`: Returns first non-null value
  - `NULLIF()`: Returns null if values are equal
  - `IFNULL()`: Returns second argument if first is null (MySQL syntax, use COALESCE in PostgreSQL)

- **Mathematical Functions**
  - `ROUND()`: Rounds to specified decimal places
  - `CEILING()`: Rounds up
  - `FLOOR()`: Rounds down
  - `ABS()`: Absolute value
  - `MOD()`: Modulo operation

### Snippet

#### Compute Total Sales and Revenue per Category

```sql
-- Create new table
DROP TABLE IF EXISTS sales_data; -- check if exists
CREATE TABLE sales_data (
  order_id        SERIAL PRIMARY KEY,
  product_name    VARCHAR(100) NOT NULL,
  category        VARCHAR(50) NOT NULL,
  quantity        INT NOT NULL CHECK (quantity >= 0),
  unit_price      DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  order_date      DATE NOT NULL,
);
```

```sql
-- Insert new values
INSERT INTO sales_data (product_name, category, quantity, unit_price, order_date)
VALUES 
  ('Laptop', 'Electronics', 1, 1200.00, '2024-01-15'),
  ('Mouse', 'Electronics', 2, 25.00, '2024-01-15'),
  ('Keyboard', 'Electronics', 1, 75.00, '2024-01-15'),
  ('Monitor', 'Electronics', 2, 300.00, '2024-01-16'),
  ('Desk', 'Furniture', 1, 250.00, '2024-01-17'),
  ('Chair', 'Furniture', 2, 150.00, '2024-01-18'),
  ('Lamp', 'Furniture', 3, 50.00, '2024-01-19'),
  ('Notebook', 'Stationery', 10, 5.00, '2024-01-20'),
  ('Pen', 'Stationery', 20, 2.00, '2024-01-20'),
  ('Backpack', 'Accessories', 1, 60.00, '2024-01-21');
```

#### SQL view

- The view doesn't store any static data, it's just a query saved in the database.
- This make report easier to maintain and understand.

```sql
CREATE OR REPLACE VIEW electronics_sales_summary AS
SELECT
  product_name,
  SUM(quantity) AS total_quantity_sold,
  SUM(quantity * unit_price) AS total_revenue
FROM sales_data
WHERE category = 'Electronics'
GROUP BY product_name;
```

### Core Techniques for Better SQL Performance

1. Read Less Data Whenever Possible

The easiest way to speed up a query is to reduce the amount of data it touches.

- Filter early with meaningful WHERE conditions.

- Avoid SELECT * only select the columns you truly need.

- Use partition filters (like date ranges) to skip unnecessary segments of data.

This keeps the query engine focused on only the relevant rows.

2. Make Joins Work in Your Favor

Joins often account for the heaviest part of analytical SQL.

- Use the correct join type. Don’t use LEFT JOIN if an INNER JOIN is enough.

- Make sure join keys are indexed or well-distributed.

- Apply filters before the join to shrink the tables.

    Pre-aggregate large tables if possible before joining.

Smaller and cleaner join inputs result in dramatically faster queries.

3. Optimize Aggregations

Aggregations like GROUP BY can be expensive.

- Group only on the columns that matter avoid grouping on very high-cardinality fields.

- Use approximate functions if exact results aren’t crucial (e.g., approximate distinct counts).

- Perform early summarization to reduce final result size.

These choices help reduce both compute time and memory usage.

4. Use Window Functions Wisely

Window functions are powerful for analytical work, but they can slow things down if used blindly.

- Keep partitions as small as possible.

- Reuse window definitions rather than repeating the same logic.

- Filter or aggregate data before applying window operations.

A little planning goes a long way toward faster execution.

5. Manage CTEs and Subqueries Thoughtfully

Common Table Expressions improve clarity, but depending on the database engine, they might be reprocessed multiple times.

- Use CTEs for readability, but don’t overuse them in heavy analytical queries.

- Consider temporary tables for repeated, expensive logic.

- Inline simple subqueries that don’t need reuse.

Balancing readability and performance is key.

6. Help the Optimizer with Indexes and Statistics

Databases rely on metadata to choose the best query plan.

- Keep table statistics up to date.

- Use composite indexes when filtering on multiple columns.

- Drop indexes that aren’t helping they slow down writes.

Better metadata means smarter execution plans.

7. Think in Sets, Not Loops

SQL engines are designed for set-based operations.

- Avoid row-by-row logic or cursor-style patterns.

- Use functions like CASE, COALESCE, and set operations instead.

- Handle inserts and updates in bulk whenever possible.

Set-oriented logic is faster and more scalable.

### Operational Best Practices

- Check the execution plan regularly to understand how your query actually runs.

- Document complex logic, especially when rewriting queries for performance.

- Work closely with data engineering teams to align on modeling, indexing, and warehouse settings.

- Monitor performance over time, as data growth can impact previously fast queries.

- Use database-specific features, such as clustering keys, materialized views, or caching when available
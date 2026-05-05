# SQL for Data Analysis

The lingua franca of data. Every analyst should be fluent.

## Pages

- **[Fundamentals](fundamentals.md)** — `SELECT`, joins, aggregation, window functions
- **[Data Modeling](data-modeling.md)** — Star schemas, Fact vs. Dimension tables, ETL vs ELT
- **[Optimization](optimization.md)** — `EXPLAIN`, sargable queries, indexes, batching
- **[Snippets](snippets.md)** — common patterns

## SQL dialects

| Dialect | Notes |
|---------|-------|
| **PostgreSQL** | Open source, full standard, rich functions |
| **MySQL** | Common; some quirks |
| **SQL Server (T-SQL)** | Microsoft; uses `TOP` instead of `LIMIT` |
| **BigQuery** | Standard SQL with extensions for arrays/structs |
| **Snowflake** | Cloud DW; standard ANSI SQL |
| **DuckDB** | In-process OLAP; PostgreSQL-compatible |
| **SQLite** | Embedded; minimal feature set |

[SQL dialect reference](https://learnsql.com/blog/what-sql-dialect-to-learn/)

## Spreadsheets vs Databases

| Spreadsheets | Databases |
|--------------|-----------|
| Software application | Query language (SQL) |
| Rows and columns | Rules and relationships |
| Cells | Complex collections |
| Limited data | Huge volumes |
| Manual entry | Strict, consistent entry |
| Single user | Multi-user |
| User-controlled | DBMS-controlled |

## Order of operations

The order SQL **logically** evaluates clauses (different from how you write them):

1. `FROM` / `JOIN`
2. `WHERE`
3. `GROUP BY`
4. `HAVING`
5. `SELECT`
6. `DISTINCT`
7. `ORDER BY`
8. `LIMIT` / `OFFSET`

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/)

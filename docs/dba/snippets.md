# Practical Snippets

## SQL Server on macOS (Apple Silicon)

**Install:** Recommend `OrbStack` for better Docker performance

Set a local password in your shell first — don't hardcode one in commands you might share:

```bash
export MSSQL_SA_PASSWORD='Test@12345'

docker run -e "ACCEPT_EULA=Y" \
           -e "MSSQL_SA_PASSWORD=${MSSQL_SA_PASSWORD}" \
           -p 127.0.0.1:1433:1433 \
           --name mssql_server \
           --platform linux/amd64 \
           -d mcr.microsoft.com/mssql/server:2022-latest
```

Binding to `127.0.0.1` keeps the `sa` login reachable only from localhost — without it, port 1433 is open to any client that can reach your machine's network interface.

**Use:**

- **Option A:** GUI Tools
  Download a database client like **DBeaver**, **Azure Data Studio**, or **TablePlus**. Open the tool, create a new **Microsoft SQL Server** connection, and enter these credentials:
    - **Host:** `localhost` (or `127.0.0.1`)
    - **Port:** `1433`
    - **Username:** `sa`
    - **Password:** the value of `$MSSQL_SA_PASSWORD` set above
    - _Note:_ For SQL Server 2022, ensure you check the box for "Trust Server Certificate" (or set `encrypt=false`) in your driver settings if the connection fails.
- **Option B:** Terminal (CLI)
  ```bash
  docker exec -it mssql_server /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C
  ```
  This command will start and run `sqlcmd`.

## Execution Query Command

### Measure query execution time and I/O statistics

**Risk: Safe** <br>
Database: SQL Server

```sql
SET STATISTICS IO, TIME ON;
```

## References

- [Microsoft Learn: SQL Server Technical Documentation](https://learn.microsoft.com/en-us/sql/sql-server/?view=sql-server-ver17)
- [Microsoft Learn: Transact-SQL (T-SQL) Reference](https://learn.microsoft.com/en-us/sql/t-sql/language-reference?view=sql-server-ver17)
- [Luis Llamas: T-SQL Command Cheat Sheet](https://www.luisllamas.es/en/cheatsheet-sql/)
- [sqlcmd utility documentation](https://learn.microsoft.com/en-us/sql/tools/sqlcmd/sqlcmd-utility?view=sql-server-ver17&tabs=go%2Cwindows-support&pivots=cs1-bash)

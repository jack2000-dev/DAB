# Spreadsheets

## Security features

- Permission access — sharing settings (limit who can access)
- Hide sheet, protect sheet, encrypt with password
- View vs. comment vs. edit permissions
- Audit history (Google Sheets) / Track changes (Excel)

## Google Sheets

### Connected Sheets

[Google Sheets connects with BigQuery](https://workspace.google.com/blog/product-announcements/connected-sheets-is-generally-available) — analyze large BigQuery datasets directly in Sheets without specialized knowledge.

### Useful function references

- [Google Sheets Function List](https://support.google.com/docs/table/25273)
- [23 Must-Know Formulas](https://blog.golayer.io/google-sheets/google-sheets-formulas)
- [Tips and Techniques — Ben Collins](https://www.benlcollins.com/spreadsheets/google-sheets-formulas-techniques/)
- [Graphs in Google Sheets — DataCamp](https://www.datacamp.com/tutorial/graphs-in-spreadsheets)

### Functions cheat

| Function | Description |
|----------|-------------|
| `IMPORTRANGE("url", "Sheet1!A1:F13")` | Import a range from another sheet |
| `IMPORTHTML("url", "table", n)` | Web-scrape an HTML table or list |
| `IMPORTDATA("url")` | Import CSV/TSV from URL |
| `VLOOKUP(value, range, col, false)` | Look up value (false = exact match) |
| `XLOOKUP(value, lookup_range, return_range)` | Modern replacement; left-to-right not required |
| `INDEX + MATCH` | More flexible lookup |
| `LEN(s)` | String length |
| `FIND(needle, s)` | Position of substring |
| `LEFT(s, n)` / `RIGHT(s, n)` | First / last n chars |
| `MID(s, start, len)` | Substring |
| `VALUE(s)` | Convert text-number to number |
| `TRIM(s)` | Remove extra whitespace |
| `PRODUCT(a, b, ...)` | Multiply |
| `SUMPRODUCT(arr1, arr2)` | Sum of element-wise products |
| `QUERY(range, "SELECT A WHERE B > 10")` | SQL-like query (Google Sheets) |
| `ARRAYFORMULA(...)` | Apply formula across whole column (Google Sheets) |

### Pivot tables

`Insert > Pivot table` — summarize, aggregate, drill down.

| Sort sheet | Sort range |
|------------|-----------|
| Data across rows kept together | Only selected cells rearranged (isolation) |

## Excel

Microsoft's spreadsheet. Common in finance and corporate.

### References

- [Microsoft — Excel function reference](https://support.microsoft.com/en-us/office/excel-functions-alphabetical-b3944572-255d-4efb-bb96-c6d90033e188)
- [Excel cheat sheet — exceljet](https://exceljet.net/keyboard-shortcuts)

### Useful Excel-specific

- **Power Query** — ETL-in-Excel; load, clean, merge data
- **Power Pivot** — DAX measures, large data models
- **PivotTables** — same concept as Sheets
- **Conditional formatting** — highlight outliers
- **Data validation** — restrict input

## Spreadsheet tips

- Keep raw data on its own tab; computed views separate
- Lock formula cells; allow input cells
- Document with named ranges
- Build models in tables (`Ctrl+T`); structured references
- Avoid merged cells (break sorting/filtering)

## References

- [Top 10 ways to clean data — Microsoft](https://support.microsoft.com/en-us/office/top-ten-ways-to-clean-your-data-2844b620-677c-47a7-ac3e-c2e157d1db19)
- [Google Sheets help](https://support.google.com/docs/topic/9054603)
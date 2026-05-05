# Process

Clean, transform, ensure integrity. Prepare data for analysis.

> Data integrity is critical. Watch for data replication. Manipulate to make data more organized and easier to read. The data engineering team owns the data warehouse.

!!! tip "See also"
    Detailed cleaning patterns live in **[Data Cleaning](data-cleaning.md)** — the same phase, more depth.

## Why this phase matters

Most analyst time is spent here, not in modeling. Cleaning is unglamorous but it's where trust comes from. A model trained on dirty data misleads with confidence.

## Pre-cleaning steps

1. **Backup the raw data** — never edit the original
2. Determine **data integrity** — accuracy, consistency, completeness
3. Connect **objectives to data** — how do business goals map to the dataset?
4. Set **thresholds** — what counts as "clean enough"?
5. Know **when to stop** collecting

## Data integrity checks

| Check | What to verify |
|-------|----------------|
| **Completeness** | All required fields populated? |
| **Uniqueness** | No duplicate primary keys? |
| **Consistency** | Same value formatted the same across rows? |
| **Validity** | Values within expected range / types? |
| **Accuracy** | Match source of truth? |
| **Timeliness** | Is data current? |

## Objective ↔ Data

- Clean data + business alignment = accurate conclusion
- Alignment + new variables + constraints = accurate conclusion

Spreadsheet helpers:

- `VLOOKUP` — check column values against a reference
- `XLOOKUP` — modern replacement; left-to-right not required
- `DATEDIF` — difference between two date columns

## Insufficient Data

| Type | Solution |
|------|----------|
| Single source | Talk to stakeholders; adjust objective |
| Updating data | Identify trends with what's available |
| Outdated | Find a newer dataset |
| Geographically limited | Wait for more data if time allows |
| Sample too small | Increase n; use bootstrap; widen CI |

## Sample Size

- Use **≥ 30** when possible (Central Limit Theorem)
- Larger n → narrower CI, smaller margin of error
- Larger n → higher cost
- **Sampling bias** — sample not representative
- **Random sampling** — equal chance → more representative
- **Confidence level** — usually 95% (sometimes 90%)

Calculators:

- [SurveyMonkey sample size](https://www.surveymonkey.com/learn/research-and-analysis/sample-size-calculator/)
- [Raosoft](http://www.raosoft.com/samplesize.html)
- [Margin of error calculator](https://goodcalculators.com/margin-of-error-calculator/)

## Choose your tools

| Volume / complexity | Tool |
|---------------------|------|
| < 10K rows, ad-hoc | Google Sheets / Excel |
| < 1M rows, scripted | Python (pandas) |
| 1M – 100M rows | DuckDB, polars, SQL |
| > 100M rows | BigQuery, Snowflake, Spark |
| Repeat pipelines | dbt, Airflow, Prefect |

## Data-cleaning Checklist

See **[Data Cleaning](data-cleaning.md)** for full techniques. Quick version:

- [ ] **Determine size** — large datasets have more issues; affects time/tools
- [ ] **Categories/labels** — diversity of dataset
- [ ] **Missing data** — find nulls; plan remediation
- [ ] **Unformatted data** — check formats
- [ ] **Data types** — pick appropriate methods

## Document the cleaning process

Keep a change log so you (and others) can reproduce results later.

```markdown
# Cleaning log — orders dataset
2026-03-15
- Loaded raw `orders_2026Q1.csv` (152,433 rows)
- Removed 412 duplicate `order_id`s (kept latest by `created_at`)
- Cast `total` to numeric; 18 rows had `'$' '` prefix → stripped, recast
- Dropped 92 test orders where `email` ends with '@example.test'
- Filled `country` nulls with `'unknown'` (37 rows)
- Output: `orders_2026Q1_clean.parquet` (151,892 rows)
```

## Checklist

- [ ] Backup made
- [ ] Errors identified and documented
- [ ] Tools chosen
- [ ] Data transformed for analysis
- [ ] Cleaning log written
- [ ] Deliverable: documentation of any cleaning or manipulation

## References

- [Top 10 ways to clean data — Microsoft](https://support.microsoft.com/en-us/office/top-ten-ways-to-clean-your-data-2844b620-677c-47a7-ac3e-c2e157d1db19)
- [Google Workspace — Cleaning Tips](https://support.google.com/a/users/answer/9604139)
- [Tidy Data — Wickham](https://vita.had.co.nz/papers/tidy-data.html)
- [pandas — Working with missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)
- [Great Expectations](https://greatexpectations.io/) — data validation framework

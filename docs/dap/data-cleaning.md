# Data Cleaning

Detailed techniques for the Process phase. Make data trustworthy before analyzing it.

## Why clean

- **Dirty data** = incomplete, incorrect, irrelevant
- Clean data + business alignment = accurate conclusion
- Dirty data poisons every downstream chart, model, and decision

## Common issues

| Issue | Description |
|-------|-------------|
| Duplicate data | Same record appears more than once |
| Outdated data | Old values that should be replaced |
| Incomplete data | Missing fields |
| Inconsistent data | Same thing in different formats |
| Null | Empty fields |
| Truncated data | Cut off mid-value |
| Mistyped numbers | Stored as text, wrong precision |
| Inconsistent dates | Mix of `MM/DD/YYYY` and `YYYY-MM-DD` |
| Misspellings | "USA", "U.S.A.", "United States" |

## Tidy data principles (Wickham)

1. Each variable forms a column
2. Each observation forms a row
3. Each type of observational unit forms a table

## IQR — outlier detection (1.5 rule)

The most common outlier rule.

1. Compute Q1 (25th percentile) and Q3 (75th percentile)
2. IQR = Q3 − Q1
3. Lower bound = Q1 − 1.5 × IQR
4. Upper bound = Q3 + 1.5 × IQR
5. Anything outside is an outlier

```python
import pandas as pd

q1, q3 = df['salary'].quantile([0.25, 0.75])
iqr = q3 - q1
mask = (df['salary'] < q1 - 1.5 * iqr) | (df['salary'] > q3 + 1.5 * iqr)
outliers = df[mask]
clean = df[~mask]
```

```sql
WITH bounds AS (
  SELECT
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY salary) AS q1,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY salary) AS q3
  FROM employees
)
SELECT *
FROM employees, bounds
WHERE salary < q1 - 1.5 * (q3 - q1)
   OR salary > q3 + 1.5 * (q3 - q1);
```

## Z-score outlier detection

Flag where |Z| > 3 (rare for normal data).

```python
from scipy import stats
z = stats.zscore(df['salary'])
outliers = df[abs(z) > 3]
```

## Missing data strategies

| Strategy | When to use |
|----------|-------------|
| Drop rows | Few missing, MCAR (missing completely at random) |
| Drop columns | Column is mostly empty |
| Mean / median impute | Numeric, low % missing |
| Mode impute | Categorical, low % missing |
| Forward / backward fill | Time series |
| Predictive imputation | High value, large dataset (KNN, MICE) |
| Flag with sentinel | When missingness is informative |

## Frequently used cleaning functions

=== "SQL"

    ```sql
    INSERT INTO ...
    UPDATE ... SET ...
    SELECT DISTINCT col FROM tbl;
    LENGTH(col)
    SUBSTR(col, 1, 5)
    TRIM(col)
    LOWER(col) / UPPER(col)
    CAST(col AS INT)
    CONCAT(a, b)
    COALESCE(col, 'default')
    NULLIF(col, '')
    REGEXP_REPLACE(col, '\s+', ' ', 'g')
    ```

=== "Python (pandas)"

    ```python
    df.drop_duplicates(subset=['email'])
    df.dropna(subset=['email'])
    df['email'] = df['email'].str.lower().str.strip()
    df['amount'] = df['amount'].astype(float)
    df['date']   = pd.to_datetime(df['date'], errors='coerce')
    df['country'] = df['country'].fillna('unknown')
    df['phone'] = df['phone'].str.replace(r'\D', '', regex=True)
    df = df.rename(columns={'old':'new'})
    ```

## SQL cleaning patterns

### Remove duplicates

```sql
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) AS rn
  FROM users
)
DELETE FROM users WHERE id IN (SELECT id FROM ranked WHERE rn > 1);
```

### Normalize strings

```sql
UPDATE customers
SET email = LOWER(TRIM(email)),
    name  = TRIM(REGEXP_REPLACE(name, '\s+', ' ', 'g'));
```

### Handle NULLs

```sql
SELECT COALESCE(phone, 'unknown') FROM users;
SELECT NULLIF(TRIM(phone), '') FROM users;
SELECT * FROM users WHERE email IS NOT NULL;
```

### Audit before destructive changes

```sql
BEGIN;
-- Count what you'll affect
SELECT COUNT(*) FROM users WHERE email IS NULL;
-- Sample
SELECT * FROM users WHERE email IS NULL LIMIT 10;
-- Apply
UPDATE users SET email = 'unknown' WHERE email IS NULL;
-- Verify
SELECT COUNT(*) FROM users WHERE email = 'unknown';
-- COMMIT; or ROLLBACK;
```

## Python (pandas) cleaning patterns

### Inspect first

```python
df.info()
df.describe(include='all')
df.isna().sum().sort_values(ascending=False)
df.duplicated().sum()
df.head(); df.sample(5)
```

### Strings

```python
df['name'] = df['name'].str.strip().str.title()
df['email'] = df['email'].str.lower()
df['phone'] = df['phone'].str.replace(r'\D', '', regex=True)
df = df[df['email'].str.contains('@', na=False)]
```

### Types

```python
df['amount'] = df['amount'].astype(float)
df['date']   = pd.to_datetime(df['date'], errors='coerce')
df['cat']    = df['cat'].astype('category')
```

### Outliers (IQR)

```python
q1, q3 = df['price'].quantile([0.25, 0.75])
iqr = q3 - q1
df = df[(df['price'] >= q1 - 1.5 * iqr) & (df['price'] <= q3 + 1.5 * iqr)]
```

### Group + aggregate

```python
df.groupby('country').agg(
    revenue=('amount', 'sum'),
    customers=('user_id', 'nunique'),
    avg_order=('amount', 'mean'),
)
```

### Validation with Pandera

```python
import pandera as pa
from pandera.typing import Series

class Schema(pa.DataFrameModel):
    user_id: Series[int]    = pa.Field(unique=True)
    email:   Series[str]    = pa.Field(str_matches=r'.+@.+\..+')
    age:     Series[int]    = pa.Field(ge=0, le=120, nullable=True)

Schema.validate(df)
```

## Data-cleaning checklist

- [ ] **Make a backup** before cleaning
- [ ] **Determine size** — affects time/tools
- [ ] **Categories/labels** — understand diversity
- [ ] **Identify missing data** — plan remediation
- [ ] **Identify unformatted data** — ensure uniformity
- [ ] **Explore data types** — pick appropriate methods
- [ ] Check spelling, misfielded values, duplicates
- [ ] Document errors

## Data verification checklist

- [ ] Sources of errors identified with the right tools
- [ ] Nulls scanned (filters, conditional formatting)
- [ ] Misspellings located
- [ ] Mistyped numbers double-checked
- [ ] Extra spaces / characters removed (`TRIM`)
- [ ] Duplicates removed
- [ ] Mismatched data types recast
- [ ] Inconsistent strings normalized
- [ ] Date formats consistent
- [ ] Column names meaningful
- [ ] Truncated data identified
- [ ] Business logic sanity check

## Workflow automation

- [Great Expectations](https://greatexpectations.io/) — data validation framework
- [dbt tests](https://docs.getdbt.com/docs/build/data-tests) — schema and data tests in SQL
- [Pandera](https://pandera.readthedocs.io/) — DataFrame schema validation
- [Towards Data Science — Automating analysis](https://towardsdatascience.com/automating-scientific-data-analysis-part-1-c9979cd0817e)

## References

- [Tidy Data — Hadley Wickham (PDF)](https://vita.had.co.nz/papers/tidy-data.pdf)
- [Top 10 ways to clean data — Microsoft](https://support.microsoft.com/en-us/office/top-ten-ways-to-clean-your-data-2844b620-677c-47a7-ac3e-c2e157d1db19)
- [pandas — Data cleaning](https://pandas.pydata.org/docs/user_guide/missing_data.html)
- [PostgreSQL — String Functions](https://www.postgresql.org/docs/current/functions-string.html)
- [scikit-learn — Imputation](https://scikit-learn.org/stable/modules/impute.html)

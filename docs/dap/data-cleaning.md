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

## Cleaning operations

Click each operation to see the same dirty input transformed.

<div class="sx-explorer" data-variant="dedup" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="dedup"        aria-pressed="true">dedup</button>
    <button class="sx-btn" data-variant="trim_lower"   aria-pressed="false">trim + lower</button>
    <button class="sx-btn" data-variant="fillna"       aria-pressed="false">fill NULL</button>
    <button class="sx-btn" data-variant="drop_null"    aria-pressed="false">drop NULL</button>
    <button class="sx-btn" data-variant="cast_type"    aria-pressed="false">cast type</button>
    <button class="sx-btn" data-variant="parse_date"   aria-pressed="false">parse date</button>
    <button class="sx-btn" data-variant="split_col"    aria-pressed="false">split column</button>
    <button class="sx-btn" data-variant="regex_phone"  aria-pressed="false">regex strip</button>
    <button class="sx-btn" data-variant="outlier_iqr"  aria-pressed="false">drop outliers</button>
  </div>
  <div class="sx-stage">
    <div class="sx-sublabel">Before</div>
    <div class="sx-table-wrap" data-stage="input"></div>
    <div class="sx-arrow">↓</div>
    <div class="sx-sublabel">After</div>
    <div class="sx-table-wrap" data-stage="output"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
    <pre class="sx-sql"><code data-field="sql"></code></pre>
  </div>
</div>
<script>
sxInit(document.currentScript, {
  initial: 'dedup',
  variants: {
    dedup: { name:'Remove duplicates', level:'intermediate',
      tag:'one row per natural key',
      desc:'Use <code>ROW_NUMBER()</code> with a tie-breaker (latest <code>created_at</code>) to keep one canonical row per email.',
      sql:'WITH ranked AS (\n  SELECT *,\n         ROW_NUMBER() OVER (\n           PARTITION BY email\n           ORDER BY created_at DESC\n         ) AS rn\n  FROM users\n)\nSELECT id, email, created_at\nFROM   ranked\nWHERE  rn = 1;',
      stages:{
        input: { cols:['id','email','created_at'], rows:[
          [1,'alice@x.com','2025-01-01'],
          [2,'bob@x.com',  '2025-02-15'],
          [3,'alice@x.com','2025-03-10'],
          [4,'bob@x.com',  '2024-12-20'],
          [5,'cara@x.com', '2025-01-05']
        ]},
        output:{ cols:['id','email','created_at'], rows:[
          [3,'alice@x.com','2025-03-10'],
          [2,'bob@x.com',  '2025-02-15'],
          [5,'cara@x.com', '2025-01-05']
        ]}
      }
    },
    trim_lower: { name:'Normalize strings', level:'beginner',
      tag:'trim whitespace + casefold',
      desc:'Strip surrounding whitespace and lower-case so equality matches behave. Do this once on insert when possible.',
      sql:"UPDATE users\nSET    email = LOWER(TRIM(email));",
      stages:{
        input: { cols:['id','email'], rows:[
          [1,'  Alice@Gmail.com  '],
          [2,'BOB@yahoo.com'],
          [3,'cara@x.com ']
        ]},
        output:{ cols:['id','email'], rows:[
          [1,'alice@gmail.com'],
          [2,'bob@yahoo.com'],
          [3,'cara@x.com']
        ]}
      }
    },
    fillna: { name:'Fill NULL with default', level:'beginner',
      tag:'COALESCE — first non-null wins',
      desc:'Replace missing values with a sentinel so downstream code doesn\'t branch on <code>NULL</code>.',
      sql:"SELECT id, name, COALESCE(country, 'unknown') AS country\nFROM   users;",
      stages:{
        input: { cols:['id','name','country'], rows:[
          [1,'Alice','US'],
          [2,'Bob',null],
          [3,'Cara','UK'],
          [4,'Dan',null]
        ]},
        output:{ cols:['id','name','country'], rows:[
          [1,'Alice','US'],
          [2,'Bob','unknown'],
          [3,'Cara','UK'],
          [4,'Dan','unknown']
        ]}
      }
    },
    drop_null: { name:'Drop rows with NULL', level:'beginner',
      tag:'required field missing → discard',
      desc:'When a column is required for analysis (e.g. <code>email</code>), drop rows that lack it rather than imputing.',
      sql:'SELECT *\nFROM   users\nWHERE  email IS NOT NULL;',
      stages:{
        input: { cols:['id','name','email'], rows:[
          [1,'Alice','alice@x.com'],
          [2,'Bob',null],
          [3,'Cara','cara@x.com'],
          [4,'Dan',null]
        ]},
        output:{ cols:['id','name','email'], rows:[
          [1,'Alice','alice@x.com'],
          [3,'Cara','cara@x.com']
        ]}
      }
    },
    cast_type: { name:'Cast to numeric', level:'intermediate',
      tag:'string-typed numbers · garbage → NULL',
      desc:'Numbers stored as text break math. Cast safely — invalid values become <code>NULL</code> instead of erroring.',
      sql:'SELECT id,\n       CAST(NULLIF(total, \'\') AS numeric) AS total\nFROM   orders;',
      stages:{
        input: { cols:['id','total'], rows:[
          [101,'100'],
          [102,'50.5'],
          [103,'abc']
        ]},
        output:{ cols:['id','total'], rows:[
          [101,100],
          [102,50.5],
          [103,null]
        ]}
      }
    },
    parse_date: { name:'Parse mixed-format dates', level:'intermediate',
      tag:'normalize to a single timestamp type',
      desc:'CSV exports often mix formats. Coerce everything to a real timestamp on ingest, with one canonical zone.',
      sql:"SELECT id,\n       COALESCE(\n         TO_TIMESTAMP(created_at, 'YYYY-MM-DD\"T\"HH24:MI'),\n         TO_TIMESTAMP(created_at, 'YYYY-MM-DD'),\n         TO_TIMESTAMP(created_at, 'MM/DD/YYYY')\n       ) AS created_at\nFROM   users;",
      stages:{
        input: { cols:['id','created_at'], rows:[
          [1,'2025-03-15'],
          [2,'03/15/2025'],
          [3,'2025-03-15T14:30']
        ]},
        output:{ cols:['id','created_at'], rows:[
          [1,'2025-03-15 00:00:00'],
          [2,'2025-03-15 00:00:00'],
          [3,'2025-03-15 14:30:00']
        ]}
      }
    },
    split_col: { name:'Split one column into many', level:'intermediate',
      tag:'one field, multiple atoms',
      desc:'Split a composite field into atomic columns. Pick a delimiter strategy that handles the messy cases (missing parts, multiple spaces).',
      sql:"SELECT id,\n       SPLIT_PART(full_name, ' ', 1)              AS first_name,\n       NULLIF(SPLIT_PART(full_name, ' ', 2), '') AS last_name\nFROM   users;",
      stages:{
        input: { cols:['id','full_name'], rows:[
          [1,'Alice Smith'],
          [2,'Bob Lee'],
          [3,'Cara']
        ]},
        output:{ cols:['id','first_name','last_name'], rows:[
          [1,'Alice','Smith'],
          [2,'Bob','Lee'],
          [3,'Cara',null]
        ]}
      }
    },
    regex_phone: { name:'Strip non-digits', level:'intermediate',
      tag:'regex replace · canonical phone format',
      desc:'Phone numbers arrive in dozens of formats. Strip every non-digit so equality and lookup work.',
      sql:"UPDATE users\nSET    phone = REGEXP_REPLACE(phone, '\\D', '', 'g');",
      stages:{
        input: { cols:['id','phone'], rows:[
          [1,'(555) 123-4567'],
          [2,'555.987.6543'],
          [3,'5551112222']
        ]},
        output:{ cols:['id','phone'], rows:[
          [1,'5551234567'],
          [2,'5559876543'],
          [3,'5551112222']
        ]}
      }
    },
    outlier_iqr: { name:'Drop outliers (IQR)', level:'advanced',
      tag:'1.5 × IQR rule',
      desc:'Tukey\'s rule: keep rows inside <code>[Q1 − 1.5·IQR, Q3 + 1.5·IQR]</code>. Robust against extreme values that drag means around.',
      sql:"WITH q AS (\n  SELECT PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total) AS q1,\n         PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total) AS q3\n  FROM   orders\n)\nSELECT o.*\nFROM   orders o, q\nWHERE  o.total BETWEEN q.q1 - 1.5*(q.q3-q.q1)\n                  AND q.q3 + 1.5*(q.q3-q.q1);",
      stages:{
        input: { cols:['id','total'], rows:[
          [1,50],[2,80],[3,95],[4,110],[5,9999],[6,75]
        ]},
        output:{ cols:['id','total'], rows:[
          [1,50],[2,80],[3,95],[4,110],[6,75]
        ]}
      }
    }
  }
});
</script>


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

```markdown
- [ ] **Make a backup** before cleaning
- [ ] **Determine size** — affects time/tools
- [ ] **Categories/labels** — understand diversity
- [ ] **Identify missing data** — plan remediation
- [ ] **Identify unformatted data** — ensure uniformity
- [ ] **Explore data types** — pick appropriate methods
- [ ] Check spelling, misfielded values, duplicates
- [ ] Document errors
```

## Data verification checklist

```markdown
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
```

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

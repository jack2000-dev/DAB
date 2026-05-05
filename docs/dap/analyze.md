# Analyze

Identify trends and relationships. Answer questions. Solve problems.

## Why this phase matters

This is where curiosity turns into insight. Without disciplined exploration, you'll either confirm what you already believed (confirmation bias) or drown in numbers without finding the signal.

## 4 phases of analysis

1. **Organize** data — sort, group, structure
2. **Format and adjust** — types, units, granularity
3. **Get input** from others — peer review, stakeholder sanity check
4. **Transform** — pivot, reshape, derive new columns

## EDA — Exploratory Data Analysis

The process of investigating, organizing, and analyzing datasets and summarizing main characteristics, using data wrangling and visualization.

### Practices

| Practice | Description |
|----------|-------------|
| **Discovering** | Familiarize with data; conceptualize use |
| **Structuring** | Organize/transform raw data — sort, extract, filter, slice, group, merge |
| **Cleaning** | Remove errors that distort data |
| **Joining** | Augment with values from other datasets |
| **Validating** | Verify consistency and quality |
| **Presenting** | Make cleaned data/visuals available to others |

### Standard EDA workflow

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('data.csv')

# 1. Shape, types, summary
df.shape; df.dtypes; df.info()
df.describe(include='all')

# 2. Missing & duplicates
df.isna().mean().sort_values(ascending=False)
df.duplicated().sum()

# 3. Distributions
df.hist(figsize=(12, 8), bins=30)

# 4. Correlations
sns.heatmap(df.select_dtypes('number').corr(), annot=True)

# 5. Relationships
sns.pairplot(df.sample(min(500, len(df))))
```

See [Python → EDA](../python/eda.md) for the full pattern.

## Data validation

| Type | What to check |
|------|---------------|
| Data type | int vs string vs date |
| Data range | min/max bounds |
| Data constraints | NOT NULL, UNIQUE, FK |
| Data consistency | Same format across rows |
| Data structure | Schema correctness |
| Code validation | Logic checks in queries |

In Google Sheets: `Data > Data validation` to set rules and prevent mis-input.  
**Conditional formatting** — visually surface outliers.

## Data aggregation

Combine data into a whole.

| Tool | Pattern |
|------|---------|
| Spreadsheet | `VLOOKUP`, `XLOOKUP`, `SUMIFS`, pivot tables |
| SQL | `GROUP BY`, `SUM`, `AVG`, `COUNT`, `MAX`, `MIN`, window functions |
| pandas | `df.groupby('col').agg({...})`, `pivot_table`, `crosstab` |

```sql
SELECT
  country,
  COUNT(*)              AS orders,
  COUNT(DISTINCT user_id) AS customers,
  SUM(total)            AS revenue,
  AVG(total)            AS avg_order
FROM orders
GROUP BY country
HAVING SUM(total) > 10000
ORDER BY revenue DESC;
```

```python
df.groupby('country').agg(
    orders=('id', 'count'),
    customers=('user_id', 'nunique'),
    revenue=('total', 'sum'),
    avg_order=('total', 'mean'),
)
```

## Common analytical patterns

| Pattern | When to use |
|---------|-------------|
| **Cohort analysis** | Track behavior across signup cohorts (retention, monetization) |
| **Funnel analysis** | Find drop-off across sequential steps |
| **Segmentation** | Group users/customers by behavior or attribute |
| **Time series decomposition** | Trend + seasonality + residual |
| **A/B comparison** | Test vs. control |
| **Cross-tab / pivot** | Counts at the intersection of two categoricals |
| **Top N per group** | Best customers per region, etc. |
| **Year-over-year / period-over-period** | Growth rates |

Snippets in [SQL → Snippets](../sql/snippets.md) and [Python → Snippets](../python/snippets.md).

## Temporary Tables (SQL)

Use cases:

- Pre-processing / staging
- Combine results from multiple queries
- Store filtered subset (skip refilter each time)

```sql
-- CTE — preferred for one-off
WITH filtered AS (
  SELECT * FROM orders WHERE status = 'paid'
)
SELECT customer_id, SUM(total) FROM filtered GROUP BY customer_id;

-- Temp table — when reused across queries in a session
CREATE TEMP TABLE staging AS
SELECT * FROM raw WHERE created_at >= '2026-01-01';

DROP TABLE staging;
```

Best practices:

- **Global vs. local** — global for all DB users (deleted on all-disconnect); local for current session
- Always `DROP TABLE` after use
- Auto-deleted at SQL session end

## Troubleshooting questions

- How should I prioritize these issues?
- In one sentence, what's the issue I'm facing?
- What resources can help me solve the problem?
- How can I prevent this issue in the future?
- What's the simplest version of this analysis that still answers the question?

## Self-questions

- Does the data align with the PLAN in PACE?
- Do you have enough data to follow through?
- What surprises did you find?
- What would change my mind about my hypothesis?
- Have I controlled for confounders?
- Am I confusing correlation with causation?

## Bias to watch for

| Bias | Description |
|------|-------------|
| **Confirmation** | Seeing only evidence supporting your hypothesis |
| **Survivorship** | Analyzing only "survivors" (e.g., active users) |
| **Selection** | Sample isn't representative |
| **Anchoring** | First number heard biases later estimates |
| **Recency** | Overweighting recent data |
| **Cherry-picking** | Choosing the time window that supports the story |

## Checklist

- [ ] Data aggregated, useful, accessible
- [ ] Organized and formatted
- [ ] Calculations performed
- [ ] Trends and relationships identified
- [ ] Findings peer-reviewed
- [ ] Bias considered explicitly
- [ ] Deliverable: summary of analysis

## References

- [pandas — Group by](https://pandas.pydata.org/docs/user_guide/groupby.html)
- [PostgreSQL — CTE](https://www.postgresql.org/docs/current/queries-with.html)
- [Kaggle Learn — Data Visualization](https://www.kaggle.com/learn/data-visualization)
- [Tukey — Exploratory Data Analysis (book)](https://www.amazon.com/Exploratory-Data-Analysis-John-Tukey/dp/0201076160)
- [HBR — Beware spurious correlations](https://hbr.org/2015/06/beware-spurious-correlations)

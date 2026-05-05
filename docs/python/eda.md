# EDA — Exploratory Data Analysis

Familiarize, structure, clean, join, validate, present.

## EDA practices

| Practice | Description |
|----------|-------------|
| **Discovering** | Familiarize yourself with data; conceptualize use |
| **Structuring** | Sort, extract, filter, slice, group, merge |
| **Cleaning** | Remove errors that distort data |
| **Joining** | Augment with values from other datasets |
| **Validating** | Check consistency and quality |
| **Presenting** | Make it available for further analysis |

## Standard EDA workflow

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('data.csv')

# 1. Shape and types
df.shape
df.dtypes
df.info()

# 2. Numeric summary
df.describe()

# 3. Categorical summary
df.describe(include='object')
df['category'].value_counts(normalize=True)

# 4. Missing
df.isna().sum().sort_values(ascending=False)
df.isna().mean().sort_values(ascending=False)  # ratio

# 5. Duplicates
df.duplicated().sum()

# 6. Distributions
df.hist(figsize=(12, 8), bins=30); plt.tight_layout()

# 7. Correlations
sns.heatmap(df.select_dtypes('number').corr(), annot=True, cmap='coolwarm')

# 8. Pairwise
sns.pairplot(df.sample(min(500, len(df))))
```

## Raw data sources

- Reports from a computer system
- Selection from large online databases
- Manually entered data tables

## Raw data formats

- Tabular files
- XML files
- CSV (`pd.read_csv`)
- Excel (`pd.read_excel`)
- DB files (`pd.read_sql`)
- JSON (`pd.read_json`)
- Parquet (`pd.read_parquet`)

## Self-questions during EDA

- Does the data align with the PLAN (PACE)?
- Do you have enough data to follow through?
- How can I break this into smaller groups to understand it better?
- How can I prove or disprove my hypothesis?
- In its current form, can this give me the answers I need?

## Structuring techniques

```python
# Sort
df.sort_values(['country', 'revenue'], ascending=[True, False])

# Extract
df['year'] = pd.to_datetime(df['date']).dt.year

# Filter
df[df['amount'] > 100]

# Slice
df.iloc[0:10, 0:3]

# Group
df.groupby('country')['revenue'].sum()

# Merge
pd.merge(orders, customers, on='customer_id', how='left')
```

## Pandas profiling (auto EDA)

```bash
uv add ydata-profiling
```

```python
from ydata_profiling import ProfileReport
ProfileReport(df, title='EDA').to_file('report.html')
```

## References

- [pandas — User Guide](https://pandas.pydata.org/docs/user_guide/index.html)
- [Kaggle Learn — Pandas](https://www.kaggle.com/learn/pandas)
- [ydata-profiling](https://github.com/ydataai/ydata-profiling)
- [Tukey — Exploratory Data Analysis](https://www.amazon.com/Exploratory-Data-Analysis-John-Tukey/dp/0201076160)

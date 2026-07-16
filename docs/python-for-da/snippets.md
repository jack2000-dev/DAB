# Python Snippets

Copy-paste building blocks.

## Connect to a Postgres database

```python
import os
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine(os.environ['DATABASE_URL'])
df = pd.read_sql('SELECT * FROM users WHERE created_at > :since',
                 engine, params={'since': '2026-01-01'})
```

## Read multiple CSVs into one DataFrame

```python
from pathlib import Path
import pandas as pd

dfs = [pd.read_csv(f).assign(source=f.name) for f in Path('data').glob('*.csv')]
df = pd.concat(dfs, ignore_index=True)
```

## Cohort retention

```python
df['signup_month'] = df['signup_date'].dt.to_period('M')
df['active_month'] = df['active_date'].dt.to_period('M')
df['cohort_index'] = (df['active_month'] - df['signup_month']).apply(lambda x: x.n)
cohort = df.groupby(['signup_month', 'cohort_index'])['user_id'].nunique().unstack()
retention = cohort.divide(cohort[0], axis=0)
```

## Funnel conversion

```python
funnel = (df.groupby('step')['user_id']
            .nunique()
            .reindex(['visit','signup','purchase']))
funnel_pct = funnel / funnel.iloc[0]
```

## A/B test (two-proportion z-test)

```python
from statsmodels.stats.proportion import proportions_ztest

success = [120, 150]   # conversions
n       = [1000, 1000] # visitors
z, p = proportions_ztest(success, n)
print(f'z={z:.2f}, p={p:.4f}')
```

## Linear regression with statsmodels

```python
import statsmodels.api as sm
X = sm.add_constant(df[['ad_spend', 'season']])
model = sm.OLS(df['revenue'], X).fit()
print(model.summary())
```

## Save plot to file

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 5))
df['revenue'].plot(ax=ax, title='Revenue')
fig.savefig('revenue.png', dpi=150, bbox_inches='tight')
```

## Convert wide → long

```python
long = df.melt(id_vars=['user_id'], value_vars=['mon','tue','wed'],
               var_name='day', value_name='hours')
```

## Weighted average

```python
def weighted_avg(group):
    return (group['value'] * group['weight']).sum() / group['weight'].sum()

df.groupby('category').apply(weighted_avg)
```

## Bin numeric to category

```python
df['age_group'] = pd.cut(df['age'], bins=[0, 17, 34, 54, 100],
                         labels=['<18','18-34','35-54','55+'])
df['rev_quartile'] = pd.qcut(df['revenue'], q=4, labels=['Q1','Q2','Q3','Q4'])
```

## Anti-join (rows in A not in B)

```python
m = a.merge(b, on='id', how='left', indicator=True)
only_in_a = m[m['_merge'] == 'left_only'].drop(columns='_merge')
```

## Date features

```python
df['date'] = pd.to_datetime(df['date'])
df['year'] = df['date'].dt.year
df['quarter'] = df['date'].dt.quarter
df['weekday'] = df['date'].dt.day_name()
df['is_weekend'] = df['date'].dt.weekday >= 5
df['days_since'] = (pd.Timestamp.today() - df['date']).dt.days
```

## References

- [pandas — Cookbook](https://pandas.pydata.org/docs/user_guide/cookbook.html)
- [statsmodels examples](https://www.statsmodels.org/stable/examples/index.html)

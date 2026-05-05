# Python (pandas) Cheatsheet

[⭐ Recommended Cheatsheet](https://labex.io/pythoncheatsheet/)

## I/O

```python
pd.read_csv('f.csv')             pd.read_excel('f.xlsx')
pd.read_parquet('f.parquet')     pd.read_json('f.json')
pd.read_sql('SELECT ...', conn)  df.to_csv('out.csv', index=False)
```

## Inspect

```python
df.head(); df.tail(); df.sample(5)
df.shape; df.size; df.columns; df.dtypes
df.info(); df.describe(); df.describe(include='all')
df.isna().sum(); df.duplicated().sum()
df.memory_usage(deep=True)
```

## Select

```python
df['col']                  # Series
df[['a','b']]              # DataFrame
df.loc[0:5, 'a':'c']       # label-based
df.iloc[0:5, 0:3]          # position-based
df.query('a > 5 and b == "x"')
df[df['a'] > 5]
```

## Modify

```python
df['new'] = df['a'] + df['b']
df = df.assign(ratio=df['a'] / df['b'])
df = df.rename(columns={'old':'new'})
df = df.drop(columns=['x', 'y'])
df = df.drop_duplicates(subset=['email'])
df = df.dropna(subset=['email'])
df = df.fillna({'age': df['age'].median(), 'country': 'unknown'})
```

## Type conversion

```python
df['x'] = df['x'].astype(int)
df['d'] = pd.to_datetime(df['d'], errors='coerce')
df['c'] = df['c'].astype('category')
```

## Strings

```python
df['s'].str.lower()           df['s'].str.strip()
df['s'].str.contains('@')     df['s'].str.startswith('A')
df['s'].str.replace('-', '')  df['s'].str.split('@', expand=True)
df['s'].str.extract(r'(\d+)')
```

## Dates

```python
df['d'].dt.year      df['d'].dt.month     df['d'].dt.day
df['d'].dt.weekday   df['d'].dt.quarter   df['d'].dt.to_period('M')
df['d'].diff()       df['d'] - pd.Timestamp('2026-01-01')
```

## Group / aggregate

```python
df.groupby('country')['revenue'].sum()
df.groupby('country').agg(rev=('revenue','sum'), n=('user_id','nunique'))
df.groupby(['country','plan'])['revenue'].mean().unstack()
df.groupby('country', as_index=False)['revenue'].sum()
```

## Pivot / reshape

```python
df.pivot_table(index='month', columns='product', values='units', aggfunc='sum')
df.melt(id_vars='month', var_name='product', value_name='units')
df.stack(); df.unstack()
```

## Merge / concat

```python
pd.merge(a, b, on='id', how='left')   # also: 'inner','right','outer','cross'
pd.concat([a, b], axis=0)             # stack rows
pd.concat([a, b], axis=1)             # stack columns
```

## Sort

```python
df.sort_values(['country','rev'], ascending=[True, False])
df.sort_index()
df.nlargest(10, 'rev'); df.nsmallest(10, 'rev')
```

## Apply / map

```python
df['x'].apply(lambda v: v * 2)
df['cat'].map({'a': 1, 'b': 2})
df.apply(lambda row: row['a'] + row['b'], axis=1)
```

## Window / rolling

```python
df['rolling_avg'] = df['rev'].rolling(7).mean()
df['cumsum']      = df['rev'].cumsum()
df['rank']        = df['rev'].rank(method='dense', ascending=False)
df['pct_change']  = df['rev'].pct_change()
```

## Plot quick

```python
df['rev'].plot(kind='line')
df['rev'].plot(kind='hist', bins=30)
df.plot.scatter(x='spend', y='revenue')
```

## References

- [pandas — Cheat Sheet (PDF)](https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf)
- [pandas docs](https://pandas.pydata.org/docs/)

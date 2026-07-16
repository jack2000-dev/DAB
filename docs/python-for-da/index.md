# Python for Data Analysis

Python is the de-facto language for data analysis. This section covers EDA, the core libraries, and copy-paste snippets.

## Pages

- **[EDA](eda.md)** — exploratory data analysis workflow
- **[Libraries](libraries.md)** — pandas, numpy, matplotlib, seaborn, plotly, scipy, statsmodels
- **[Snippets](snippets.md)** — ready-to-use code blocks

## Why Python

- Free, open source, huge ecosystem
- One language for ETL, analysis, visualization, modeling, deployment
- Reproducible (notebooks, scripts, version control)
- Active community on Kaggle, Stack Overflow, Towards Data Science

## Setup with uv

```bash
uv init my-analysis
cd my-analysis
uv add pandas numpy matplotlib seaborn jupyter
uv run jupyter lab
```

## Reading and writing data

```python
import pandas as pd

df = pd.read_csv('file.csv')
df = pd.read_excel('file.xlsx', sheet_name='Sheet1')
df = pd.read_parquet('file.parquet')
df = pd.read_json('file.json')
df = pd.read_sql('SELECT * FROM users', conn)

df.to_csv('out.csv', index=False)
df.to_parquet('out.parquet')
```

## References

- [pandas docs](https://pandas.pydata.org/docs/)
- [Python for Data Analysis — Wes McKinney](https://wesmckinney.com/book/)
- [Kaggle Learn — Python](https://www.kaggle.com/learn/python)
- [Real Python — pandas tutorials](https://realpython.com/learning-paths/pandas-data-science/)

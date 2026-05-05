# Python Libraries for Data Analysis

The core stack. Install with uv:

```bash
uv add pandas numpy matplotlib seaborn plotly scipy statsmodels scikit-learn jupyter
```

## pandas — tabular data

DataFrame and Series. The workhorse.

```python
import pandas as pd
df = pd.read_csv('data.csv')
df.groupby('country')['revenue'].sum()
```

Docs: [pandas.pydata.org](https://pandas.pydata.org/docs/)

## NumPy — numerical arrays

Underlies pandas. Vectorized math.

```python
import numpy as np
a = np.array([1, 2, 3])
np.mean(a); np.std(a); np.percentile(a, 95)
```

Docs: [numpy.org](https://numpy.org/doc/stable/)

## matplotlib — plotting

Foundational charting library.

```python
import matplotlib.pyplot as plt
plt.plot(x, y); plt.xlabel('Date'); plt.ylabel('Revenue'); plt.show()
```

Docs: [matplotlib.org](https://matplotlib.org/stable/)

## seaborn — statistical viz

Built on matplotlib, opinionated, prettier defaults.

```python
import seaborn as sns
sns.boxplot(data=df, x='category', y='revenue')
sns.heatmap(df.corr(), annot=True)
sns.pairplot(df)
```

Docs: [seaborn.pydata.org](https://seaborn.pydata.org/)

## plotly — interactive viz

Hoverable, zoomable, dashboard-ready.

```python
import plotly.express as px
px.scatter(df, x='ad_spend', y='revenue', color='channel', size='clicks')
```

Docs: [plotly.com/python](https://plotly.com/python/)

## SciPy — scientific computing

Statistical tests, optimization, signal processing.

```python
from scipy import stats
stats.ttest_ind(group_a, group_b)
stats.pearsonr(x, y)
stats.zscore(arr)
```

Docs: [scipy.org](https://docs.scipy.org/doc/scipy/)

## statsmodels — econometrics & stats models

Linear / logistic regression, time series, ANOVA. Returns rich statistical summaries.

```python
import statsmodels.api as sm
X = sm.add_constant(df[['x1', 'x2']])
model = sm.OLS(df['y'], X).fit()
print(model.summary())
```

Docs: [statsmodels.org](https://www.statsmodels.org/stable/)

## scikit-learn — machine learning

Models, preprocessing, evaluation.

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LogisticRegression().fit(X_train, y_train)
model.score(X_test, y_test)
```

Docs: [scikit-learn.org](https://scikit-learn.org/stable/)

## Jupyter — interactive notebooks

```bash
uv add jupyter
uv run jupyter lab
```

Docs: [jupyter.org](https://jupyter.org/)

## Other useful libraries

| Library | Purpose |
|---------|---------|
| [polars](https://pola.rs/) | Fast DataFrame in Rust; pandas alternative |
| [duckdb](https://duckdb.org/) | In-process SQL on parquet/CSV/pandas |
| [pyarrow](https://arrow.apache.org/docs/python/) | Columnar in-memory format |
| [great-expectations](https://greatexpectations.io/) | Data validation framework |
| [pandera](https://pandera.readthedocs.io/) | Schema validation for DataFrames |
| [requests](https://requests.readthedocs.io/) | HTTP API calls |
| [openpyxl](https://openpyxl.readthedocs.io/) | Excel I/O |
| [sqlalchemy](https://www.sqlalchemy.org/) | SQL ORM/connection |

## References

- [Wes McKinney — Python for Data Analysis](https://wesmckinney.com/book/)
- [PyData ecosystem](https://pydata.org/)
- [Awesome-python — Data Analysis](https://github.com/vinta/awesome-python#data-analysis)

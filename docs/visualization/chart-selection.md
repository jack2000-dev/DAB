# Chart Selection

Match the chart to the question.

## Decision flow

1. **What is the question?** Comparison, trend, distribution, composition, relationship, geographic
2. **How many variables?** 1, 2, or many
3. **What data type?** Numeric, categorical, time, geographic

## Chart types

| Name | Use | When |
|------|-----|------|
| **Bar graph** | Compare values across categories | Discrete categories on X; values on Y |
| **Bar chart (horizontal)** | Rank data | Long category labels; many categories |
| **Line graph** | Show changes over time | Continuous time on X |
| **Area chart** | Cumulative trend | Magnitude + trend |
| **Pie chart** | Part-of-whole | ≤ 4 slices, sums to 100% |
| **Donut chart** | Part-of-whole | Same as pie; better label space |
| **Map (choropleth/symbol)** | Geographic distribution | Region/country/state data |
| **Histogram** | Distribution of one variable | Bin frequency of values |
| **Box plot** | Distribution + outliers | Compare distributions across groups |
| **Heatmap** | Magnitude across two dimensions | Matrix of values |
| **Scatterplot** | Relationship between two variables | Correlation, clusters, outliers |
| **Bubble chart** | Three variables (x, y, size) | Scatter + magnitude |
| **Sankey** | Flow between stages | Funnel, energy, traffic |
| **Treemap** | Hierarchical part-of-whole | Nested categories |
| **Waterfall** | Sequential additive change | Variance breakdown |

## Choose by question

| Question | Chart |
|----------|-------|
| "How does X compare across categories?" | Bar |
| "How has X changed over time?" | Line |
| "What's the distribution of X?" | Histogram, box plot |
| "How does X break down?" | Stacked bar, treemap |
| "Is X related to Y?" | Scatter |
| "Where is X happening?" | Map |
| "How does X flow through stages?" | Funnel, Sankey |

## Common mistakes

- Pie charts with > 4 slices → use bar chart
- Truncated y-axis → exaggerates differences
- 3D charts → distort perception
- Too many colors → audience can't parse
- Dual y-axes → easy to mislead

## Color

- Sequential — single hue, varying lightness (for ordinal/quantitative)
- Diverging — two hues from neutral (for centered scales: e.g. -100% / +100%)
- Categorical — distinct hues (for unordered categories)
- Test for color blindness ([ColorBrewer](https://colorbrewer2.org/))

## References

- [From Data to Viz](https://www.data-to-viz.com/)
- [Data Viz Catalogue](https://datavizcatalogue.com/)
- [ColorBrewer](https://colorbrewer2.org/)
- [Tableau — chart guide](https://www.tableau.com/chart)

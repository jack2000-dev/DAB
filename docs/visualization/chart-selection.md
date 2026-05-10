# Chart Selection

Match the chart to the question.

## Pick a chart by goal

Start with what you want to *show*. Click a goal to see chart options that fit, with the typical use case and common pitfalls.

<div class="sx-explorer" data-variant="comparison" markdown="0">
  <div class="sx-buttons">
    <button class="sx-btn" data-variant="comparison"   aria-pressed="true">Comparison</button>
    <button class="sx-btn" data-variant="trend"        aria-pressed="false">Trend</button>
    <button class="sx-btn" data-variant="distribution" aria-pressed="false">Distribution</button>
    <button class="sx-btn" data-variant="composition"  aria-pressed="false">Composition</button>
    <button class="sx-btn" data-variant="relationship" aria-pressed="false">Relationship</button>
    <button class="sx-btn" data-variant="ranking"      aria-pressed="false">Ranking</button>
    <button class="sx-btn" data-variant="flow"         aria-pressed="false">Flow</button>
    <button class="sx-btn" data-variant="geographic"   aria-pressed="false">Geographic</button>
  </div>
  <div class="sx-stage">
    <div data-stage="cards"></div>
  </div>
  <div class="sx-meta">
    <div class="sx-name"><span data-field="name"></span><span class="sx-level" data-field="level" data-level="beginner"></span></div>
    <div class="sx-tag"  data-field="tag"></div>
    <div class="sx-desc" data-field="desc"></div>
  </div>
</div>
<script>
(function(){
  // Mini SVGs per chart type. viewBox 0 0 100 40.
  var SVG = {
    bar_v: '<svg viewBox="0 0 100 40"><rect class="cc-bar" x="6" y="22" width="14" height="18"/><rect class="cc-bar" x="26" y="14" width="14" height="26"/><rect class="cc-bar" x="46" y="6" width="14" height="34"/><rect class="cc-bar" x="66" y="18" width="14" height="22"/></svg>',
    bar_h: '<svg viewBox="0 0 100 40"><rect class="cc-bar" x="0" y="4" width="80" height="6"/><rect class="cc-bar" x="0" y="14" width="60" height="6"/><rect class="cc-bar" x="0" y="24" width="40" height="6"/><rect class="cc-bar" x="0" y="34" width="20" height="6"/></svg>',
    line:  '<svg viewBox="0 0 100 40"><polyline class="cc-line" points="2,30 20,22 38,26 56,12 74,18 92,4"/></svg>',
    area:  '<svg viewBox="0 0 100 40"><polygon class="cc-area" points="2,40 2,30 20,22 38,26 56,12 74,18 92,4 92,40"/><polyline class="cc-line" points="2,30 20,22 38,26 56,12 74,18 92,4"/></svg>',
    hist:  '<svg viewBox="0 0 100 40"><rect class="cc-bar" x="2" y="32" width="11" height="8"/><rect class="cc-bar" x="14" y="22" width="11" height="18"/><rect class="cc-bar" x="26" y="10" width="11" height="30"/><rect class="cc-bar" x="38" y="6" width="11" height="34"/><rect class="cc-bar" x="50" y="14" width="11" height="26"/><rect class="cc-bar" x="62" y="22" width="11" height="18"/><rect class="cc-bar" x="74" y="30" width="11" height="10"/><rect class="cc-bar" x="86" y="34" width="11" height="6"/></svg>',
    box:   '<svg viewBox="0 0 100 40"><line class="cc-axis" x1="20" y1="20" x2="40" y2="20"/><line class="cc-axis" x1="60" y1="20" x2="80" y2="20"/><rect class="cc-bar" x="40" y="10" width="20" height="20"/><line class="cc-axis" x1="50" y1="10" x2="50" y2="30" stroke-width="2"/><line class="cc-axis" x1="20" y1="14" x2="20" y2="26" stroke-width="1.5"/><line class="cc-axis" x1="80" y1="14" x2="80" y2="26" stroke-width="1.5"/></svg>',
    stack: '<svg viewBox="0 0 100 40"><g><rect class="cc-bar" x="6" y="20" width="14" height="20"/><rect class="cc-bar" x="6" y="10" width="14" height="10" opacity=".5"/><rect class="cc-bar" x="6" y="4" width="14" height="6" opacity=".3"/></g><g><rect class="cc-bar" x="26" y="14" width="14" height="26"/><rect class="cc-bar" x="26" y="6" width="14" height="8" opacity=".5"/><rect class="cc-bar" x="26" y="2" width="14" height="4" opacity=".3"/></g><g><rect class="cc-bar" x="46" y="22" width="14" height="18"/><rect class="cc-bar" x="46" y="14" width="14" height="8" opacity=".5"/><rect class="cc-bar" x="46" y="8" width="14" height="6" opacity=".3"/></g><g><rect class="cc-bar" x="66" y="16" width="14" height="24"/><rect class="cc-bar" x="66" y="10" width="14" height="6" opacity=".5"/><rect class="cc-bar" x="66" y="4" width="14" height="6" opacity=".3"/></g></svg>',
    pie:   '<svg viewBox="0 0 100 40"><circle class="cc-slice" cx="50" cy="20" r="16" fill="var(--sx-fill)" opacity=".75"/><path class="cc-slice" d="M 50 20 L 50 4 A 16 16 0 0 1 64 28 Z" fill="var(--sx-fill)" opacity=".4"/><path class="cc-slice" d="M 50 20 L 64 28 A 16 16 0 0 1 38 28 Z" fill="var(--sx-fill)" opacity=".55"/></svg>',
    tree:  '<svg viewBox="0 0 100 40"><rect class="cc-bar" x="0" y="0" width="50" height="40" stroke="var(--md-default-bg-color)" stroke-width="1.5"/><rect class="cc-bar" x="50" y="0" width="30" height="22" opacity=".55" stroke="var(--md-default-bg-color)" stroke-width="1.5"/><rect class="cc-bar" x="80" y="0" width="20" height="22" opacity=".4" stroke="var(--md-default-bg-color)" stroke-width="1.5"/><rect class="cc-bar" x="50" y="22" width="50" height="18" opacity=".7" stroke="var(--md-default-bg-color)" stroke-width="1.5"/></svg>',
    scat:  '<svg viewBox="0 0 100 40"><circle class="cc-dot" cx="10" cy="32" r="2.5"/><circle class="cc-dot" cx="22" cy="24" r="2.5"/><circle class="cc-dot" cx="35" cy="28" r="2.5"/><circle class="cc-dot" cx="48" cy="14" r="2.5"/><circle class="cc-dot" cx="60" cy="20" r="2.5"/><circle class="cc-dot" cx="72" cy="10" r="2.5"/><circle class="cc-dot" cx="86" cy="6" r="2.5"/></svg>',
    bubble:'<svg viewBox="0 0 100 40"><circle class="cc-dot" cx="20" cy="28" r="3" opacity=".7"/><circle class="cc-dot" cx="40" cy="16" r="6" opacity=".7"/><circle class="cc-dot" cx="60" cy="22" r="4" opacity=".7"/><circle class="cc-dot" cx="80" cy="10" r="8" opacity=".7"/></svg>',
    heat:  '<svg viewBox="0 0 100 40"><rect class="cc-bar" x="10" y="4" width="14" height="10" opacity=".3"/><rect class="cc-bar" x="26" y="4" width="14" height="10" opacity=".5"/><rect class="cc-bar" x="42" y="4" width="14" height="10" opacity=".9"/><rect class="cc-bar" x="58" y="4" width="14" height="10" opacity=".6"/><rect class="cc-bar" x="74" y="4" width="14" height="10" opacity=".2"/><rect class="cc-bar" x="10" y="16" width="14" height="10" opacity=".5"/><rect class="cc-bar" x="26" y="16" width="14" height="10" opacity=".8"/><rect class="cc-bar" x="42" y="16" width="14" height="10" opacity="1"/><rect class="cc-bar" x="58" y="16" width="14" height="10" opacity=".4"/><rect class="cc-bar" x="74" y="16" width="14" height="10" opacity=".3"/><rect class="cc-bar" x="10" y="28" width="14" height="10" opacity=".2"/><rect class="cc-bar" x="26" y="28" width="14" height="10" opacity=".4"/><rect class="cc-bar" x="42" y="28" width="14" height="10" opacity=".6"/><rect class="cc-bar" x="58" y="28" width="14" height="10" opacity=".3"/><rect class="cc-bar" x="74" y="28" width="14" height="10" opacity=".5"/></svg>',
    sankey:'<svg viewBox="0 0 100 40"><rect class="cc-bar" x="2" y="4" width="6" height="14"/><rect class="cc-bar" x="2" y="22" width="6" height="14"/><rect class="cc-bar" x="92" y="2" width="6" height="10"/><rect class="cc-bar" x="92" y="14" width="6" height="14"/><rect class="cc-bar" x="92" y="30" width="6" height="8"/><path class="cc-area" d="M 8 4 C 50 4 50 2 92 2 L 92 12 C 50 12 50 18 8 18 Z"/><path class="cc-area" d="M 8 22 C 50 22 50 14 92 14 C 92 28 50 28 8 36 Z"/></svg>',
    water: '<svg viewBox="0 0 100 40"><rect class="cc-bar" x="6" y="10" width="12" height="26"/><rect class="cc-bar" x="22" y="6" width="12" height="6" opacity=".75"/><rect class="cc-bar" x="38" y="2" width="12" height="6" opacity=".75"/><rect class="cc-bar" x="54" y="2" width="12" height="10" opacity=".4"/><rect class="cc-bar" x="70" y="6" width="12" height="8" opacity=".4"/><rect class="cc-bar" x="86" y="2" width="12" height="34"/></svg>',
    map:   '<svg viewBox="0 0 100 40"><path class="cc-area" d="M 10 8 L 30 4 L 50 10 L 70 6 L 90 12 L 90 34 L 70 32 L 50 36 L 30 30 L 10 32 Z"/><circle class="cc-dot" cx="30" cy="20" r="3"/><circle class="cc-dot" cx="55" cy="22" r="4"/><circle class="cc-dot" cx="75" cy="18" r="2"/></svg>'
  };

  function card(svgKey, name, when, not){
    return '<div class="sx-chart-card">' + SVG[svgKey] +
      '<div class="cc-name">' + name + '</div>' +
      '<div class="cc-when">' + when + '</div>' +
      '<div class="cc-not">Not for: ' + not + '</div></div>';
  }
  function grid(){
    var cards = Array.prototype.slice.call(arguments);
    return '<div class="sx-chart-grid">' + cards.join('') + '</div>';
  }

  sxInit(document.currentScript, {
    initial: 'comparison',
    variants: {
      comparison: {
        name:'Comparison', level:'beginner',
        tag:'how does X compare across categories?',
        desc:'Use bars when categories are discrete and you want quick visual ranking.',
        stages:{ cards:{ html: grid(
          card('bar_v', 'Bar (vertical)',   'Few discrete categories, magnitude on y-axis.', 'long category labels — flip horizontal.'),
          card('bar_h', 'Bar (horizontal)', 'Many categories or long labels — easier to read.', 'time-series — use a line chart.')
        )}}
      },
      trend: {
        name:'Trend over time', level:'beginner',
        tag:'how has X changed?',
        desc:'Continuous time on the x-axis. Lines are best for change-rate; areas emphasise magnitude.',
        stages:{ cards:{ html: grid(
          card('line', 'Line chart', 'Continuous time series, one or a few series.', 'discrete categories — use a bar chart.'),
          card('area', 'Area chart', 'Single cumulative trend, or stacked totals over time.', 'comparing many series — overlap obscures values.')
        )}}
      },
      distribution: {
        name:'Distribution of one variable', level:'intermediate',
        tag:'what does the spread look like?',
        desc:'Histograms answer "how often", box plots compare spread + outliers across groups.',
        stages:{ cards:{ html: grid(
          card('hist', 'Histogram', 'One numeric variable, see shape (skew, modes, gaps).', 'comparing groups — use box plot.'),
          card('box',  'Box plot',  'Compare distributions across categories at a glance.', 'audience unfamiliar with quartiles.')
        )}}
      },
      composition: {
        name:'Composition (part-of-whole)', level:'beginner',
        tag:'how does X break down?',
        desc:'Stacked bars compare composition across categories; pie/donut for one whole; treemap for hierarchy.',
        stages:{ cards:{ html: grid(
          card('stack','Stacked bar', 'Composition of multiple groups, comparable bases.', 'precise comparison of inner segments.'),
          card('pie',  'Pie / donut', 'One whole with ≤ 4 distinct slices.', '≥ 5 slices, or close-in-size slices.'),
          card('tree', 'Treemap',     'Nested categories with sizes (hierarchy).', 'small datasets — too sparse to read.')
        )}}
      },
      relationship: {
        name:'Relationship between variables', level:'intermediate',
        tag:'is X related to Y?',
        desc:'Scatter for two numeric vars, bubble adds a size dimension, heatmap for two-dimension magnitudes.',
        stages:{ cards:{ html: grid(
          card('scat',  'Scatter',  'Two numeric vars — see correlation, clusters, outliers.', 'one variable — use histogram.'),
          card('bubble','Bubble',   'Three numeric vars (x, y, size).', 'too many points — becomes unreadable.'),
          card('heat',  'Heatmap',  'Magnitude across two categorical or binned axes.', 'precise value reading — use a table.')
        )}}
      },
      ranking: {
        name:'Ranking (top-N / bottom-N)', level:'beginner',
        tag:'who\'s on top?',
        desc:'Sort the bar chart. Horizontal bars handle long labels and many entries cleanly.',
        stages:{ cards:{ html: grid(
          card('bar_h', 'Sorted horizontal bar', 'Top-N or bottom-N by a single metric.', 'showing change over time — use a line.')
        )}}
      },
      flow: {
        name:'Flow between stages', level:'advanced',
        tag:'where does X go?',
        desc:'Sankey for many-to-many flows; waterfall for sequential additive change.',
        stages:{ cards:{ html: grid(
          card('sankey','Sankey',     'Funnels, energy flows, traffic between many stages.', 'simple before/after — use a bar.'),
          card('water', 'Waterfall',  'Sequential adds and subtracts (variance breakdown, P&L).', 'non-additive metrics (ratios, percentages).')
        )}}
      },
      geographic: {
        name:'Geographic distribution', level:'intermediate',
        tag:'where is X happening?',
        desc:'Choropleth shades regions by value; symbol maps put marks at locations.',
        stages:{ cards:{ html: grid(
          card('map', 'Map (choropleth / symbol)', 'Region/country/state-level data with a geographic story.', 'audience without geographic context — use bar.')
        )}}
      }
    }
  });
}());
</script>


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

# Visualization Tools

## Tableau

Industry standard for BI dashboards.

- Platform: [public.tableau.com](https://public.tableau.com/)
- Docs: [help.tableau.com](https://help.tableau.com/current/pro/desktop/en-us/default.htm)
- Learn: [public.tableau.com/learn](https://public.tableau.com/app/learn/how-to-videos)
- Charts guide: [tableau.com/chart](https://www.tableau.com/chart)
- Viz of the Day: [public.tableau.com/discover](https://public.tableau.com/app/discover)

| Resource | Description |
|----------|-------------|
| [Set up data sources](https://help.tableau.com/current/pro/desktop/en-us/datasource_prepare.htm) | Connect and prep data |
| [Join your data](https://help.tableau.com/current/pro/desktop/en-us/joining_tables.htm) | Combine sources by common fields |
| [Relationships](https://help.tableau.com/v2020.2/pro/desktop/en-us/datasource_dont_be_scared.htm) | Combine multiple sources |
| [Data blending](https://help.tableau.com/current/pro/desktop/en-us/multiple_connections.htm) | Query across sources without true join |
| [Combining date fields](https://kb.tableau.com/articles/howto/combining-start-and-end-dates-into-a-single-axis) | Handle multiple date columns |

## Metabase

Open source, lightweight BI. [metabase.com](https://www.metabase.com/)

- Self-hosted or cloud
- Question-based query builder
- Native SQL editor
- Dashboards and alerts
- Good for SMBs and internal use

## Other options

| Tool | Notes |
|------|-------|
| [Looker / Looker Studio](https://lookerstudio.google.com/) | Google BI; free Studio |
| [Power BI](https://powerbi.microsoft.com/) | Microsoft BI; tight Excel integration |
| [Mode](https://mode.com/) | SQL + Python notebooks + dashboards |
| [Hex](https://hex.tech/) | Notebooks + apps + SQL |
| [Superset](https://superset.apache.org/) | Apache OSS BI |
| [Grafana](https://grafana.com/) | Time-series and ops dashboards |
| [Observable](https://observablehq.com/) | D3-style notebooks; web-native |
| [Flourish](https://flourish.studio/) | Storytelling visualizations |
| [Datawrapper](https://www.datawrapper.de/) | Newsroom-grade charts |

## Web / programmatic

- [Plotly](https://plotly.com/) — Python, R, JS
- [Vega-Lite](https://vega.github.io/vega-lite/) — JSON grammar of graphics
- [D3](https://d3js.org/) — low-level JS, full control
- [ggplot2](https://ggplot2.tidyverse.org/) — R, grammar of graphics
- [Altair](https://altair-viz.github.io/) — Vega-Lite for Python

## Choosing a tool

| If… | Use |
|-----|-----|
| Enterprise, biggest install base | Tableau / Power BI |
| Tight on budget, small team | Metabase / Looker Studio |
| Already on Google Cloud | Looker / Studio |
| Already on Microsoft 365 | Power BI |
| Need notebook + dashboards | Mode / Hex |
| Devs build it; ops watch it | Grafana |
| Build into a product | Plotly / Vega-Lite / D3 |

## References

- [Tableau learn](https://www.tableau.com/learn)
- [Metabase docs](https://www.metabase.com/docs/latest/)
- [Vega-Lite gallery](https://vega.github.io/vega-lite/examples/)

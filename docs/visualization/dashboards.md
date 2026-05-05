# Dashboard Architecture

Building a single chart is easy. Building a dashboard that stakeholders actually use requires careful information architecture and design.

## The 5-Second Rule

A stakeholder should be able to look at your dashboard and understand the current state of the business within **5 seconds**. If they have to scroll, hover, and filter just to figure out if things are "good or bad," the dashboard has failed.

## Top-Down Layout Strategy (The "F" Pattern)

Most users read screens in an "F" pattern (top-left to top-right, then down). Structure your dashboard to match this natural hierarchy:

1.  **Top Row (High-Level KPIs):** Scorecards, big numbers. "Where are we today?" Add a comparison metric (e.g., vs. last month) so the number has context.
2.  **Middle Section (Trends & Context):** Line charts, bar charts. "How did we get here? What is the trend?" 
3.  **Bottom Section (Granular Details):** Data tables, deep-dives. "Who exactly are the users contributing to this trend?"

## Principles of Good Dashboard Design

| Principle | How to Apply |
|-----------|--------------|
| **Audience First** | Don't build one dashboard for everyone. An executive needs a 10,000-foot view (KPIs). A manager needs a 1,000-foot view (trends). An operator needs ground-level details (tables). |
| **Reduce Cognitive Load** | Remove grid lines, unnecessary borders, and 3D effects. Use a maximum of 3-4 colors. Use white space to separate sections. |
| **Consistent Formatting** | If "Revenue" is green on chart A, it must be green on chart B. Always format numbers correctly (e.g., `$10.5K` instead of `10500.123`). |
| **Clear Titles** | Use titles that state the takeaway, not just the variables. *Good:* "Q3 Revenue Grew 15% Driven by EU Region." *Bad:* "Revenue by Region over Time." |

## Interactivity

Dashboards should allow users to answer their own follow-up questions without asking you for a new query.

*   **Filters:** Provide essential filters (Date Range, Region, Product Category). Don't overwhelm them with 20 filters.
*   **Drill-Downs:** Allow clicking on a bar chart (e.g., "North America") to filter the rest of the dashboard or open a detailed view for that specific region.
*   **Tooltips:** Keep tooltips clean. Only show information that adds value but would clutter the chart if placed directly on it.

## The "Data Dictionary"

Always include a small `?` icon or a footer link to a Data Dictionary that explicitly defines how each metric is calculated. (e.g., "Active User = User who logged in and clicked at least one button within the last 30 days"). This builds trust.

## References
*   [Information Dashboard Design - Stephen Few](https://www.stephen-few.com/idd.php)
*   [Tableau Best Practices](https://www.tableau.com/learn/articles/dashboard-best-practices)

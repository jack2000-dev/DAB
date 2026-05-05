# Business Metrics & KPIs

As a data analyst, you must go beyond querying data to understanding what the data represents. Key Performance Indicators (KPIs) measure the strategic health of a business.

## Types of Metrics

| Type | Description | Examples |
|------|-------------|----------|
| **Leading Indicators** | Predict future outcomes (harder to measure) | Free trial signups, website traffic |
| **Lagging Indicators** | Measure past performance (easier to measure) | Monthly revenue, churn rate |
| **North Star Metric** | The single most important metric for the company | Airbnb: Nights booked; Spotify: Time spent listening |

## Common Business Metrics

### 1. Customer Acquisition Cost (CAC)
How much it costs to acquire a new customer.
**Formula:** `Total Sales & Marketing Expenses / Number of New Customers Acquired`

### 2. Lifetime Value (LTV)
The total revenue a company expects from a single customer throughout their relationship.
**Formula:** `Average Revenue Per User (ARPU) × Average Customer Lifespan`
*Note: A healthy LTV:CAC ratio is generally considered to be 3:1 or higher.*

### 3. Churn Rate
The percentage of customers who stop using a product or service over a given period.
**Formula:** `(Lost Customers during period / Total Customers at start of period) × 100`

### 4. Retention Rate
The opposite of churn—the percentage of customers a business retains over a given period.
**Formula:** `((Total Customers at end of period - New Customers during period) / Total Customers at start of period) × 100`

### 5. Active Users (MAU / DAU)
*   **MAU:** Monthly Active Users.
*   **DAU:** Daily Active Users.
*   **Stickiness Ratio:** `DAU / MAU` (Measures how often users return. A ratio of 20% means users engage 6 days a month).

## Pitfalls to Avoid

*   **Vanity Metrics:** Numbers that look good on paper but don't inform future strategies (e.g., total registered accounts vs. active accounts).
*   **Averages without Distribution:** Always look at medians and distributions, as a few "whales" can skew averages like ARPU.
*   **Correlation vs. Causation:** Just because two metrics move together doesn't mean one causes the other.

## References
*   [Lean Analytics — Croll & Yoskovitz](http://leananalyticsbook.com/)
*   [Amplitude - North Star Playbook](https://amplitude.com/north-star)

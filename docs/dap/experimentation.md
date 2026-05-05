# Experimentation & A/B Testing

Testing allows you to establish causality rather than just correlation. A/B testing (or split testing) compares two versions of something to determine which performs better based on a specific metric.

## The A/B Testing Workflow

1.  **Define the Goal:** What metric are you trying to improve? (e.g., Conversion Rate, Click-Through Rate).
2.  **Formulate a Hypothesis:** State your assumption. Example: *Changing the "Buy Now" button from blue to green will increase the click-through rate by 5%.*
3.  **Determine Sample Size:** Calculate how many users need to see the test to reach statistical significance. Use a sample size calculator before launching.
4.  **Run the Test:** Randomly divide your audience into a Control group (Version A) and a Variant group (Version B). Let the test run until the required sample size is met.
5.  **Analyze Results:** Check for statistical significance. Determine if the difference in performance was due to the change or just random noise.

## Key Statistical Concepts

| Concept | Explanation |
|---------|-------------|
| **Control Group** | The group that sees the original, unchanged version. |
| **Variant Group** | The group that sees the new version. |
| **Statistical Significance (p-value)** | The probability that the observed results occurred by chance. Typically, you want a p-value < 0.05 (a 95% confidence level) before declaring a winner. |
| **Minimum Detectable Effect (MDE)** | The smallest improvement you care about detecting. A smaller MDE requires a larger sample size. |
| **Statistical Power** | The probability of correctly detecting a true effect (avoiding false negatives). Usually set at 80%. |

## Common Pitfalls

*   **Peeking:** Looking at results and stopping the test early because it "looks" significant. *Always let the test run to the predetermined sample size.*
*   **Too Many Variants:** Testing A/B/C/D all at once increases the chance of a false positive. Stick to A/B unless you have massive traffic.
*   **Ignoring Novelty Effect:** Users might interact more with a new feature just because it's new, causing a temporary spike that dies down over time.
*   **Testing Trivial Changes:** Ensure your tests are driven by user insights, not just random color changes.

## References
*   [Evan's Awesome A/B Tools](https://www.evanmiller.org/ab-testing/)
*   [Optimizely Glossary - A/B Testing](https://www.optimizely.com/optimization-glossary/ab-testing/)

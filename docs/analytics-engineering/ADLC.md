# The Analytics Development Lifecycle (ADLC)
![ADLC figure by dbt Labs](../assets/images/adlc-dbt.png)

# Overview

**What is ADLC?**

A framework to ensure changes to analytical data are reliable, transparent, and well-managed across the entire lifecycle—from idea to deployment and beyond.

# ADLC Process

## Plan
### Create and validate the business case
- Ensure every change is justified by a clear, documented, and agreed-upon business need before starting work.

### Create your implementation plan
- Reuse or extend existing code to keep your system efficient and reduce long-term maintenance.

### Get stakeholder feedback
- Review your proposed approach with stakeholders early to ensure alignment and avoid wasted effort.

### Create a test plan
- Define exactly how you will verify your code and handle edge cases before writing any actual code.

### Anticipate downstream impacts
- Identify who and what relies on the asset you are changing to ensure your updates do not break their workflows.

### Plan for maintenance
- Determine long-term ownership and maintenance responsibilities before development even begins.

### Determine access levels
- Establish exactly who should see the data and how sensitive information (like PII) will be protected.

### Implement larger changes in small pieces
- Break massive updates into smaller, independently testable units for faster and safer development.

## Develop
### Code first
- Ensure all business logic is written in human-readable code so it can be version-controlled, tested, and automated.

### Choose and customize your own development workflow
- Allow developers to use and personalize the tools (IDE, CLI) that maximize their individual productivity.

### Adhere to a style guide
- Enforce consistent coding styles so that the code base remains highly readable for every contributor.

### Prioritize functionality over performance
- Focus first on writing code that does the job correctly, and optimize it for speed later if necessary.

### Invest in code quality
- Write clear, well-documented, and reusable code to reduce the future burden on whoever has to maintain it.

### Get code reviewed
- Require a rigorous peer review process before any code is allowed to merge into production.

### Use standards to avoid lock-in
- Build with open languages (like SQL/Python) and open frameworks to ensure your code outlives proprietary vendor tools.

## Test
### Unit tests
- Verify that specific pieces of logic work exactly as expected, independent of the actual data.

### Data tests
- Ensure that the underlying data conforms to your expectations and business rules.

### Integration tests
- Confirm that your new changes do not break other interconnected parts of the larger system.

## Deploy
### Deployment is triggered based on a merge in source control
- Deploy updates directly from specific branches only after the code has been officially merged.

### Deployment is automated
- Eliminate manual steps so that migrating code to a new environment happens automatically.

### Deployment does not cause user-facing downtime
- Structure your systems so that deploying updates is completely invisible to end-users.

### Rollbacks are automated
- Ensure the system can automatically revert to a previous state if a deployment causes unexpected errors.

### Developers choose the size of the change
- Give developers the freedom to deploy anything from a single line of code to a massive system refactor.

## Operate and Observe

### Always-on
- Maintain analytical systems to be highly available 24/7/365 with only minimal windows for planned downtime.

### Tolerate and recover from failure
- Build systems that can quickly recover from inevitable errors rather than trying to prevent errors entirely.

### Catch errors before customers do
- Use strong monitoring tools and on-call rotations to detect and fix issues before users even notice them.

### Test in production
- Continuously monitor the live system, because complex real-world data interactions cannot be perfectly simulated in a test environment.

### Choose your own metrics, and then measure them religiously
- Define your organization's specific priorities (like uptime or latency) and hold teams strictly accountable to those goals.

### Don’t overshoot
- Only engineer for the level of reliability the business actually needs, as chasing perfect uptime is incredibly expensive.

## Discover and Analyze

### Discoverability
- Users must easily find data artifacts through a simple search without going through gatekeepers.

### In-place operations
- Users should work with data directly in the system rather than downloading files locally.

### Feedback loop
- Users need the ability to leave feedback on data assets to improve discovery and guide future planning.

### Access requests
- The system must provide a straightforward way for users to request necessary data permissions.

### Delegated access
- Users should be able to grant their own tools and AI agents access to the system.

### Validation
- Users must be able to easily verify if the data they are looking at is correct and up-to-date.

### Provenance
- Users need to easily trace exactly where any specific piece of data originally came from.

### History
- The system should expose a log of all state changes and updates made over time.

### Environment selection
- Users should be able to choose whether they are interacting with development, staging, or production data.

### Abstracted complexity
- The system must simply work for end-users without requiring them to understand its underlying technical details.

# Checklist


# References
- [ADLC - dbt Labs](https://www.getdbt.com/resources/the-analytics-development-lifecycle)

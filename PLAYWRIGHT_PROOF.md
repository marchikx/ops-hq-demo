# Playwright proof (cold hire)

## Latest live run

Command:

```bash
PLAYWRIGHT_BASE_URL=https://marchikx.github.io/ops-hq-demo/ npm run test:e2e
```

Result: **1 passed** — human outcomes for webhook, payment, LLM.

Assertions:

- `incident-console` visible
- Button 1 → `delivery-status` matches `/dead/` + `human-outcome` mentions dead-letter
- Button 2 → payment shows `202` + human-outcome mentions 202
- Button 3 → LLM status leaves `idle` + human-outcome mentions blocked

Screens: `walkthrough/01-webhook-dead.png` … `03-llm-blocked.png` (see `WALKTHROUGH.md`).

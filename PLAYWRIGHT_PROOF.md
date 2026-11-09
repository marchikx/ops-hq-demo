# Playwright proof — Ops HQ Demo

## Local (2026-11-09)

```text
npx playwright test
ok 1 [chromium] › e2e/incident.spec.ts › webhook DLQ, payment 202, LLM deny mutate UI
1 passed
```

Assertions:
- `delivery-status` → `dead` (webhook-relay DLQ)
- `payment-status` contains `202` + `applied`
- `llm-status` / log contains deny / UNKNOWN

## Live GH Pages (2026-11-09)

```text
PLAYWRIGHT_BASE_URL=https://marchikx.github.io/ops-hq-demo/
ok 1 [chromium] › e2e/incident.spec.ts › webhook DLQ, payment 202, LLM deny mutate UI
1 passed (3.9s)
```

Also: `curl -I` → HTTP 200 for `/` and `/og.png` (image/png).

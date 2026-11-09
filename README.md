# Ops HQ Demo — interactive proof for hirers

[![CI](https://github.com/marchikx/ops-hq-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/marchikx/ops-hq-demo/actions/workflows/ci.yml)

**Live:** https://marchikx.github.io/ops-hq-demo/  
**Hirer guide:** [FOR_HIRERS.md](./FOR_HIRERS.md)

Not a product SaaS. A portfolio console that answers: “can this person show a money-path failure without a slide deck?”

Press three buttons in the browser:

1. Fail a webhook → dead-letter  
2. Accept a payment → 202 then worker apply  
3. Block an LLM call → budget deny  

Those buttons import **webhook-relay**, **stripe-payments-ledger**, and **llm-guardrails** from GitHub (not mocks-only). KPI cards are seed JSON — labeled as such.

```bash
npm install
npm run verify
npm run test:e2e        # local
npm run test:e2e:live   # against GitHub Pages
```

Hire: https://github.com/marchikx/marchikx/issues/new?template=hire.md

MIT.

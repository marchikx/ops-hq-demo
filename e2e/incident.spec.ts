import { test, expect } from "@playwright/test";

test.describe("incident console", () => {
  test("webhook DLQ, payment 202, LLM deny mutate UI", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("incident-console")).toBeVisible();

    await page.getByTestId("btn-webhook").click();
    await expect(page.getByTestId("delivery-status")).toHaveText(/dead/, {
      timeout: 30_000,
    });
    await expect(page.getByTestId("incident-log")).toContainText("OutboxStore");

    await page.getByTestId("btn-payment").click();
    await expect(page.getByTestId("payment-status")).toContainText("202", {
      timeout: 15_000,
    });
    await expect(page.getByTestId("payment-status")).toContainText("applied");

    await page.getByTestId("btn-llm-deny").click();
    await expect(page.getByTestId("llm-status")).not.toHaveText("idle", {
      timeout: 10_000,
    });
    await expect(page.getByTestId("incident-log")).toContainText(/denied|UNKNOWN/i);
  });
});

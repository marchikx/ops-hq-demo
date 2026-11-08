/**
 * Thin mock of a webhook outbox / relay — portfolio pattern only, no live I/O.
 */
import type { Delivery, DeliveryStatus } from "./types";
import { loadSeed } from "./seed";

const MAX_ATTEMPTS = 5;

export function listDeliveries(): Delivery[] {
  return loadSeed().deliveries;
}

export function getDeliveryById(id: string): Delivery | undefined {
  return listDeliveries().find((d) => d.id === id);
}

export function countByStatus(): Record<DeliveryStatus, number> {
  const counts: Record<DeliveryStatus, number> = {
    pending: 0,
    delivered: 0,
    retrying: 0,
    dead_letter: 0,
  };
  for (const d of listDeliveries()) {
    counts[d.status] += 1;
  }
  return counts;
}

export function computeSuccessRate(): number {
  const kpis = loadSeed().overviewKpis;
  return kpis.webhookSuccessRate;
}

export function shouldRetry(delivery: Delivery): boolean {
  if (delivery.status === "delivered" || delivery.status === "dead_letter") {
    return false;
  }
  return delivery.attempts < MAX_ATTEMPTS;
}

export function nextOutboxAction(
  delivery: Delivery
): "send" | "retry" | "dlq" | "noop" {
  if (delivery.status === "delivered") return "noop";
  if (delivery.attempts >= MAX_ATTEMPTS) return "dlq";
  if (delivery.status === "pending") return "send";
  if (delivery.status === "retrying") return "retry";
  if (delivery.status === "dead_letter") return "noop";
  return "noop";
}

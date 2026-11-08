import seed from "@/data/seed.json";
import type { SeedData } from "./types";

export function loadSeed(): SeedData {
  return seed as SeedData;
}

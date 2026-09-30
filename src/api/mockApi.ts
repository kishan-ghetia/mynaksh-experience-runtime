import { ExperienceDefinition } from "../runtime/types";
import data from "../mock/experiences.json";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const SIMULATE_BACKEND_DOWN = false;

export async function fetchExperiences(): Promise<ExperienceDefinition[]> {
  await delay(3000);
  if (SIMULATE_BACKEND_DOWN) {
    throw new Error("Experience config server down (401)");
  }
  return data.experiences as ExperienceDefinition[];
}

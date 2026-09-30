import { ExperienceComponent } from "./types";

const registry = new Map<string, ExperienceComponent>();

export function registerExperience(
  name: string,
  version: string,
  component: ExperienceComponent,
) {
  registry.set(`${name}/${version}`, component);
}

export function resolveExperience(name: string, version: string) {
  return registry.get(`${name}/${version}`);
}

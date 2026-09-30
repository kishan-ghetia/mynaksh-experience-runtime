import { ComponentType } from "react";

export type ExperienceStatus =
  | "initializing"
  | "loading"
  | "ready"
  | "completed"
  | "failed";

export type ExperienceProps<Config> = {
  config: Config;
  onStatusChange: (status: ExperienceStatus, error?: string) => void;
};
export type ExperienceComponent = ComponentType<ExperienceProps<any>>;

export type ExperienceDefinition = {
  experience: string;
  version: string;
  entryPoint: string;
  enabled: boolean;
  config: Record<string, unknown>;
};

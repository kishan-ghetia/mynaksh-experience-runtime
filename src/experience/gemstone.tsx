import { useEffect, useState } from "react";
import { ExperienceProps } from "../runtime/types";
import { delay } from "../api/mockApi";
import { Button, Text, View } from "react-native";
import { registerExperience } from "../runtime/registry";

type GemstoneConfig = { recommendationMode?: string };

async function fetchRecommendation(mode: string) {
  await delay(6000);

  if (mode === "personalized")
    throw new Error("Personalization service unavailable (503)");
  if (mode === "generic") return "Stone A";
  throw new Error(`unknown recommendation mode ${mode}`);
}

function GemstoneV1({
  config,
  onStatusChange,
}: ExperienceProps<GemstoneConfig>) {
  const mode = config.recommendationMode ?? "generic";

  const [stone, setStone] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    onStatusChange("loading");
    fetchRecommendation(mode)
      .then((result) => {
        if (cancelled) return;
        setStone(result);
        onStatusChange("ready");
      })
      .catch((err: Error) => {
        if (!cancelled) onStatusChange("failed", err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, onStatusChange]);

  if (!stone) {
    return <Text>Finding a recommendation</Text>;
  }

  return (
    <View>
      <Text>Recommended Gem: {stone}</Text>
      <Button title="Got it" onPress={() => onStatusChange("completed")} />
    </View>
  );
}

registerExperience("gemstone", "v1", GemstoneV1);

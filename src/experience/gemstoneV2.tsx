import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { delay } from "../api/mockApi";
import { registerExperience } from "../runtime/registry";
import { ExperienceProps } from "../runtime/types";

type GemstoneV2Config = { recommendationMode?: string };

async function fetchRecommendationV2(mode: string) {
  await delay(6000);
  if (mode === "personalized") return "Personalized stone";
  if (mode === "generic") return "Stone A";
  throw new Error(`unknown recommendation mode ${mode}`);
}

function GemstoneV2({
  config,
  onStatusChange,
}: ExperienceProps<GemstoneV2Config>) {
  const mode = config.recommendationMode ?? "personalized";

  const [stone, setStone] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    onStatusChange("loading");
    fetchRecommendationV2(mode)
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
    return <Text>Finding a {mode} recommendation</Text>;
  }

  return (
    <View>
      <Text>
        Your {mode} gem: {stone}
      </Text>
      <Button title="Got it" onPress={() => onStatusChange("completed")} />
    </View>
  );
}

registerExperience("gemstone", "v2", GemstoneV2);

import { useEffect, useState } from "react";
import { ExperienceProps } from "../runtime/types";
import { delay } from "../api/mockApi";
import { Button, Text, View } from "react-native";
import { registerExperience } from "../runtime/registry";

type ConsultationConfig = { mode?: string };

const ASTROLOGERS: Record<string, string> = {
  human_astrologer: "Astrologer A",
};

async function fetchAstrologer(mode: string) {
  await delay(9000);
  const astrologer = ASTROLOGERS[mode];
  if (!astrologer) throw new Error(`Unsupported consultation mode: ${mode}`);
  return astrologer;
}

function ConsultationV1({
  config,
  onStatusChange,
}: ExperienceProps<ConsultationConfig>) {
  const mode = config.mode ?? "human_astrologer";

  const [astrologer, setAstrologer] = useState<string | null>(null);
  const [session, setSession] = useState<"waiting" | "active" | "ended">(
    "waiting",
  );

  useEffect(() => {
    let cancelled = false;
    onStatusChange("loading");
    fetchAstrologer(mode)
      .then((result) => {
        if (cancelled) return;
        setAstrologer(result);
        onStatusChange("ready");
      })
      .catch((err: Error) => {
        if (!cancelled) onStatusChange("failed", err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, onStatusChange]);

  function endSession() {
    setSession("ended");
    onStatusChange("completed");
  }

  if (!astrologer) {
    return <Text>Finding an available astrologer</Text>;
  }

  return (
    <View>
      <Text>Connected to: {astrologer}</Text>

      {session === "waiting" && (
        <Button
          title="start chat"
          onPress={() => {
            setSession("active");
          }}
        />
      )}
      {session === "active" && <Button title="End chat" onPress={endSession} />}
      {session === "ended" && <Text>chat ended</Text>}
    </View>
  );
}

registerExperience("consultation", "v1", ConsultationV1);

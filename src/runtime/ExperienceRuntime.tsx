import { useCallback, useState } from "react";
import { resolveExperience } from "./registry";
import { ExperienceDefinition, ExperienceStatus } from "./types";
import { StyleSheet, Text, View } from "react-native";
import ErrorBoundary from "./ErrorBoundary";

export default function ExperienceRuntime({
  definition,
}: {
  definition: ExperienceDefinition;
}) {
  const [status, setStatus] = useState<ExperienceStatus>("initializing");
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = useCallback(
    (next: ExperienceStatus, message?: string) => {
      setStatus(next);
      if (message) setError(message);
    },
    [],
  );

  const handleCrash = useCallback((message: string) => {
    setStatus("failed");
    setError(message);
  }, []);

  const Experience = resolveExperience(
    definition.experience,
    definition.version,
  );

  const title = `${definition.experience} ${definition.version}`;

  if (!Experience) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.error}>
          Unsupported: nothing registered for {title}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.status}>Status: {status}</Text>
      {status === "failed" ? (
        <Text style={styles.error}>Failed: {error}</Text>
      ) : (
        <ErrorBoundary onError={handleCrash}>
          <Experience
            config={definition.config}
            onStatusChange={handleStatusChange}
          />
        </ErrorBoundary>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    borderColor: "#ccc",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  status: { color: "#666" },
  error: { color: "#c00" },
});

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import "./src/experience";
import data from "./src/mock/experiences.json";
import ExperienceRuntime from "./src/runtime/ExperienceRuntime";
import { ExperienceDefinition } from "./src/runtime/types";
import { useEffect, useState } from "react";
import { fetchExperiences } from "./src/api/mockApi";

export default function App() {
  const [experiences, setExperiences] = useState<ExperienceDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchExperiences()
      .then((list) => {
        if (!cancelled) setExperiences(list);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text>Loading experience config....</Text>
        </View>
      )}
      {error && (
        <Text style={styles.error}>Could not load experiences: {error}</Text>
      )}
      {experiences
        .filter((exp) => exp.enabled)
        .map((exp, index) => (
          <ExperienceRuntime key={index} definition={exp} />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 60, gap: 12, flexGrow: 1 },
  error: { color: "#c00" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

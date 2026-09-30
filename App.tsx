import { ScrollView, StyleSheet } from "react-native";
import "./src/experience";
import data from "./src/mock/experiences.json";
import ExperienceRuntime from "./src/runtime/ExperienceRuntime";
import { ExperienceDefinition } from "./src/runtime/types";

export default function App() {
  const experiences = data.experiences as ExperienceDefinition[];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {experiences
        .filter((exp) => exp.enabled)
        .map((exp, index) => (
          <ExperienceRuntime key={index} definition={exp} />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 60, gap: 12 },
});

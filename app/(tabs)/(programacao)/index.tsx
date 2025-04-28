import { View, Text, StyleSheet } from "react-native";

export default function ProgramacaoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Programação</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#f90",
    fontSize: 24,
    fontWeight: "bold",
  },
});

// Arquivo: nexum/app/(tabs)/(programacao)/datas/[data].tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProgramacaoPorData() {
  const { data } = useLocalSearchParams();
  const router = useRouter();

  const programacaoExiste = false;

  function formatarData(data: string) {
    const dia = data.slice(0, 2);
    const mes = data.slice(2, 4);
    const ano = data.slice(4);
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/(programacao)/calendario")}>
          <Ionicons name="arrow-back" size={24} color="#f90" />
        </TouchableOpacity>
        <Text style={styles.titulo}>
            Programação do dia <Text style={styles.data}>{formatarData(data as string)}</Text>
        </Text>
      </View>

      {programacaoExiste ? (
        <Text style={{ color: "#fff" }}>Conteúdos aqui...</Text>
      ) : (
        <Text style={styles.mensagem}>Ainda não há programação para este dia.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    data: {
        color: "#f90",
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        backgroundColor: "#111",
        padding: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    },
    titulo: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        flexShrink: 1,
    },
    mensagem: {
        color: "#ccc",
        fontSize: 16,
        textAlign: "center",
        marginTop: 40,
    },
    });

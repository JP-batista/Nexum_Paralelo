import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "49283a14fc0026ef666878fda99ca3af";
const BASE_URL = "https://api.themoviedb.org/3";

export default function DetalhesElencoScreen() {
  const { id, midiaId, tipo } = useLocalSearchParams();
  const router = useRouter();
  const [ator, setAtor] = useState<any>(null);
  const [creditos, setCreditos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      try {
        const resAtor = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}&language=pt-BR`);
        const dataAtor = await resAtor.json();
        setAtor(dataAtor);

        const resCred = await fetch(`${BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}&language=pt-BR`);
        const dataCred = await resCred.json();

        const ordenados = (dataCred.cast || [])
          .filter((item: any) => item.poster_path)
          .sort((a: any, b: any) => {
            const dateA = new Date(a.release_date || a.first_air_date || "1900-01-01").getTime();
            const dateB = new Date(b.release_date || b.first_air_date || "1900-01-01").getTime();
            return dateB - dateA;
          });

        setCreditos(ordenados);
      } catch (error) {
        console.error("Erro ao buscar ator:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDados();
  }, [id]);

  function handleSelectItem(item: any) {
    const tipo = item.title ? "movie" : "tv";
    router.push({
      pathname: tipo === "movie" ? "/(tabs)/(home)/detalhesFilme" : "/(tabs)/(home)/detalhesSerie",
      params: {
        id: item.id.toString(),
        tipo,
      },
    });
  }

  function voltarParaMidiaOriginal() {
    if (!midiaId || !tipo) return;
    router.push({
      pathname: tipo === "movie" ? "/(tabs)/(home)/detalhesFilme" : "/(tabs)/(home)/detalhesSerie",
      params: { id: midiaId.toString(), tipo: tipo.toString() },
    });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f90" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity style={styles.voltarBtn} onPress={voltarParaMidiaOriginal}>
        <Ionicons name="arrow-back" size={22} color="#f90" />
        <Text style={styles.voltarTexto}>Voltar </Text>
      </TouchableOpacity>

        {ator.profile_path && (
            <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${ator.profile_path}` }}
            style={styles.atorImagem}
            />
        )}

      <View style={styles.cardAtor}>
        <Text style={styles.nome}>{ator.name}</Text>
        <Text style={styles.biografia}>{ator.biography || "Sem biografia disponível."}</Text>
      </View>

      {/* Informações Adicionais */}
      <View style={styles.infoBox}>
        <Text style={styles.info}><Text style={styles.label}>Nascimento:</Text> {ator.birthday || "?"}</Text>
        <Text style={styles.info}><Text style={styles.label}>Local:</Text> {ator.place_of_birth || "?"}</Text>
        {ator.deathday && (
          <Text style={styles.info}><Text style={styles.label}>Falecimento:</Text> {ator.deathday}</Text>
        )}
        <Text style={styles.info}><Text style={styles.label}>Área:</Text> {ator.known_for_department || "?"}</Text>
        <Text style={styles.info}><Text style={styles.label}>Popularidade:</Text> {ator.popularity?.toFixed(1)}</Text>
      </View>

      {/* Filmes e Séries */}
      <Text style={styles.sectionTitle}>Participações</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
        {creditos.map((item) => (
          <TouchableOpacity key={item.id} style={styles.posterItem} onPress={() => handleSelectItem(item)}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
            <Text style={styles.posterTitulo} numberOfLines={2}>
              {item.title || item.name}
            </Text>
            <Text style={styles.posterAno}>
              {(item.release_date || item.first_air_date || "????").split("-")[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Espaço final */}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  voltarBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  voltarTexto: {
    color: "#f90",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  cardAtor: {
    backgroundColor: "#1A1A1D",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  atorImagem: {
    width: 160,
    height: 240,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 16,
  },
  nome: {
    color: "#f90",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  biografia: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "justify",
  },
  infoBox: {
    backgroundColor: "#1A1A1D",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    color: "#999",
    fontWeight: "bold",
  },
  info: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  posterItem: {
    marginRight: 14,
    width: 120,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: "#333",
    marginBottom: 6,
  },
  posterTitulo: {
    color: "#fff",
    fontSize: 13,
  },
  posterAno: {
    color: "#aaa",
    fontSize: 12,
  },
});

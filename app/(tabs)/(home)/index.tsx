import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

const CATEGORIAS = [
  { nome: "Ação", id: 28 },
  { nome: "Comédia", id: 35 },
  { nome: "Ficção Científica", id: 878 },
];

const STREAMINGS = [
  { nome: "Netflix", id: 8 },
  { nome: "Prime Video", id: 119 },
  { nome: "Disney+", id: 337 },
];

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTI4M2ExNGZjMDAyNmVmNjY2ODc4ZmRhOTljYTNhZiIsIm5iZiI6MTc0NTYwMDU4OS43OTEwMDAxLCJzdWIiOiI2ODBiYzA0ZGU5MmY5NDBjYTY5ZDVmZTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cw9A7zCkx837i_K778P_XEhrNJUVAl3U1kMLUKErOkY",
  },
};

export default function Categorias() {
  const [conteudos, setConteudos] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [provedorSelecionado, setProvedorSelecionado] = useState(STREAMINGS[0]);

  useEffect(() => {
    const fetchConteudos = async () => {
      setLoading(true);
      const resultados: Record<string, any[]> = {};
      for (const categoria of CATEGORIAS) {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${categoria.id}&sort_by=popularity.desc&language=pt-BR&watch_region=BR&with_watch_providers=${provedorSelecionado.id}`,
          API_OPTIONS
        );
        const data = await res.json();
        resultados[categoria.nome] = data.results;
      }
      setConteudos(resultados);
      setLoading(false);
    };
    fetchConteudos();
  }, [provedorSelecionado]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Descubra por Categoria</Text>

      {/* Filtro por streaming */}
      <View style={styles.filtros}>
        {STREAMINGS.map((prov) => (
          <TouchableOpacity
            key={prov.id}
            style={
              prov.id === provedorSelecionado.id
                ? styles.filtroAtivo
                : styles.filtro
            }
            onPress={() => setProvedorSelecionado(prov)}
          >
            <Text
              style={
                prov.id === provedorSelecionado.id
                  ? styles.filtroAtivoTexto
                  : styles.filtroTexto
              }
            >
              {prov.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f90" />
        </View>
      ) : (
        CATEGORIAS.map((cat) => (
          <View key={cat.nome} style={styles.section}>
            <Text style={styles.sectionTitle}>{cat.nome}</Text>
            <FlatList
              horizontal
              data={conteudos[cat.nome]}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                    }}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title || item.name}
                  </Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  filtros: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  filtro: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 20,
  },
  filtroTexto: {
    color: "#aaa",
  },
  filtroAtivo: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f90",
    borderRadius: 20,
  },
  filtroAtivoTexto: {
    color: "#000",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    marginRight: 12,
    width: 120,
  },
  cardImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

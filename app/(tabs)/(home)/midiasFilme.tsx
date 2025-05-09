import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "49283a14fc0026ef666878fda99ca3af";
const BASE_URL = "https://api.themoviedb.org/3";

export default function MidiasFilmeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [posters, setPosters] = useState<any[]>([]);
  const [backdrops, setBackdrops] = useState<any[]>([]);
  const [logos, setLogos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchImagens() {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}/images?api_key=${API_KEY}`);
        const data = await res.json();
        setPosters(data.posters || []);
        setBackdrops(data.backdrops || []);
        setLogos(data.logos || []);
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImagens();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f90" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.voltarBtn}
        onPress={() => router.push({ pathname: "/(tabs)/(home)/detalhesFilme", params: { id } })}
      >
        <Ionicons name="arrow-back" size={20} color="#f90" />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>

      {/* Pôsteres */}
      <Text style={styles.sectionTitle}>Pôsteres</Text>
      <FlatList
        horizontal
        data={posters}
        keyExtractor={(_, i) => `poster-${i}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.file_path}` }}
            style={styles.poster}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Backdrops */}
      <Text style={styles.sectionTitle}>Banners</Text>
      <FlatList
        horizontal
        data={backdrops}
        keyExtractor={(_, i) => `backdrop-${i}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w780${item.file_path}` }}
            style={styles.banner}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Logos */}
      <Text style={styles.sectionTitle}>Logos</Text>
      <FlatList
        horizontal
        data={logos}
        keyExtractor={(_, i) => `logo-${i}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.file_path}` }}
            style={styles.logo}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  voltarBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  voltar: {
    color: "#f90",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },  
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 24,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#222",
  },
  banner: {
    width: 280,
    height: 160,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#222",
  },
  logo: {
    width: 180,
    height: 80,
    resizeMode: "contain",
    marginRight: 12,
    alignSelf: "center",
    tintColor: "#fff",
  },
});
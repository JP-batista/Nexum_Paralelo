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
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getMoviesByGenreAndProvider,
  getSeriesByGenreAndProvider,
  searchMovies,
  searchSeries,
} from "../../../services/tmdb";
import Logo from "@/assets/images/Icon2.png";
import conteudo from "@/data/conteudo.json";

const CATEGORIAS = conteudo.categorias;
const STREAMINGS = conteudo.streamings;

export default function HomeScreen() {
  const [conteudos, setConteudos] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [provedorSelecionado, setProvedorSelecionado] = useState(STREAMINGS[0]);
  const [tipoConteudo, setTipoConteudo] = useState<"filme" | "serie">("filme");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilmes, setSearchFilmes] = useState<any[]>([]);
  const [searchSeriesResult, setSearchSeriesResult] = useState<any[]>([]);
  const router = useRouter();
  const providerId = provedorSelecionado?.id ?? 0;
  const idsExibidos = new Set();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchConteudos();
    }
  }, [provedorSelecionado, tipoConteudo]);

  async function fetchConteudos() {
    setLoading(true);
    const resultados: Record<string, any[]> = {};

    for (const categoria of CATEGORIAS) {
      const dados =
        tipoConteudo === "filme"
          ? await getMoviesByGenreAndProvider(
              categoria.id,
              providerId === 0 ? undefined as unknown as number : providerId
            )
          : await getSeriesByGenreAndProvider(
              categoria.id,
              providerId === 0 ? undefined : providerId
            );

      resultados[categoria.nome] = dados;
    }

    setConteudos(resultados);
    setLoading(false);
  }

  async function handleSearch() {
    if (searchTerm.trim() === "") {
      setSearchFilmes([]);
      setSearchSeriesResult([]);
      fetchConteudos();
      return;
    }

    setLoading(true);
    const [filmes, series] = await Promise.all([
      searchMovies(searchTerm),
      searchSeries(searchTerm),
    ]);
    setSearchFilmes(filmes);
    setSearchSeriesResult(series);
    setLoading(false);
  }


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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {/* Logo e título */}
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Descubra Filmes</Text>
      </View>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filme ou série..."
          placeholderTextColor="#aaa"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Botões de tipo de conteúdo */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButtonUnified,
            tipoConteudo === "filme" && styles.toggleButtonActive,
            { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
          ]}
          onPress={() => {
            setTipoConteudo("filme");
            setSearchFilmes([]);
            setSearchSeriesResult([]);
            setSearchTerm("");
          }}
        >
          <Text
            style={[
              styles.toggleButtonText,
              tipoConteudo === "filme" && styles.toggleButtonTextActive,
            ]}
          >
            Filmes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButtonUnified,
            tipoConteudo === "serie" && styles.toggleButtonActive,
            { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
          ]}
          onPress={() => {
            setTipoConteudo("serie");
            setSearchFilmes([]);
            setSearchSeriesResult([]);
            setSearchTerm("");
          }}
        >
          <Text
            style={[
              styles.toggleButtonText,
              tipoConteudo === "serie" && styles.toggleButtonTextActive,
            ]}
          >
            Séries
          </Text>
        </TouchableOpacity>
      </View>


      {/* Filtro por streaming */}
      <View style={styles.filtrosContainer}>
        <FlatList
          horizontal
          data={STREAMINGS}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                item.id === provedorSelecionado.id ? styles.filtroAtivo : styles.filtro,
                { marginRight: 8 },
              ]}
              onPress={() => {
                setProvedorSelecionado(item);
                setSearchFilmes([]);
                setSearchSeriesResult([]);
                setSearchTerm("");
              }}
            >
              <Text
                style={
                  item.id === provedorSelecionado.id
                    ? styles.filtroAtivoTexto
                    : styles.filtroTexto
                }
              >
                {item.nome}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Resultados da busca */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f90" />
        </View>
      ) : searchTerm.trim() !== "" ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filmes encontrados</Text>
            <FlatList
              horizontal
              data={searchFilmes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => handleSelectItem(item)}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title || item.name}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Séries encontradas</Text>
            <FlatList
              horizontal
              data={searchSeriesResult}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => handleSelectItem(item)}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.name || item.title}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </>
      ) : (
        CATEGORIAS.map((cat) => {
          const lista = conteudos[cat.nome];
          if (!lista || lista.length === 0) return null;
        
          return (
            <View key={cat.nome} style={styles.section}>
              <Text style={styles.sectionTitle}>{cat.nome}</Text>
              <FlatList
                horizontal
                data={lista.filter((item) => {
                  if (idsExibidos.has(item.id)) return false;
                  idsExibidos.add(item.id);
                  return true;
                })}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.card} onPress={() => handleSelectItem(item)}>
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                      style={styles.cardImage}
                    />
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title || item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          );
        })        
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    overflow: "hidden",
  },
  
  toggleButtonUnified: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#111111",
    alignItems: "center",
  },
  
  toggleButtonActive: {
    backgroundColor: "#f90",
  },
  
  toggleButtonText: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 14,
  },
  
  toggleButtonTextActive: {
    color: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    color: "#fff",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 20,
  },
  filtrosContainer: {
    marginBottom: 24,
  },
  filtros: {
    gap: 8,
    paddingRight: 8,
  },
  filtro: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 20,
    marginBottom: 8,
  },
  filtroTexto: {
    color: "#aaa",
  },
  filtroAtivo: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f90",
    borderRadius: 20,
    marginBottom: 8,
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
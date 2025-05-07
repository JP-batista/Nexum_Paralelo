import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Pressable,
  Modal
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { adicionarAMinhaListaFirestore } from "@/services/firestore";
import { auth } from "@/services/firebase";
import { Ionicons } from "@expo/vector-icons";
import type { Prioridade } from "@/services/firestore";

const API_KEY = "49283a14fc0026ef666878fda99ca3af";
const BASE_URL = "https://api.themoviedb.org/3";


export default function DetalhesFilmeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [filme, setFilme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState<any[]>([]);
  const [plataforma, setPlataforma] = useState<string>("Desconhecido");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [expandido, setExpandido] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [filmeSelecionado, setFilmeSelecionado] = useState<any | null>(null);

  interface Plataforma {
    nome: string;
    logoUrl: string;
  }
  
  useEffect(() => {
    async function fetchFilme() {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
        const data = await res.json();
        setFilme(data);
  
        await buscarPlataformas(data.id.toString(), "movie");
  
        const creditRes = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=pt-BR`);
        const creditData = await creditRes.json();
        setCast(creditData.cast?.slice(0, 20) || []);
      } catch (error) {
        console.error("Erro ao buscar filme:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchFilme();
  }, [id]);
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f90" />
      </View>
    );
  }

  if (!filme) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </View>
    );
  }

  function handleAdicionarLista(filme: any) {
    setFilmeSelecionado(filme);
    setModalVisible(true);
  }

  async function salvarComPrioridade(prioridade: Prioridade) {
    if (!filmeSelecionado) return;
    const usuario = auth.currentUser;
    if (!usuario) return;
  
    try {
      const plataforma = await buscarPlataforma(filmeSelecionado.id.toString(), "movie");
  
      await adicionarAMinhaListaFirestore(usuario.uid, {
        titulo: filmeSelecionado.title,
        tipo: "Filme",
        plataforma,
        prioridade,
        tmdb_id: filmeSelecionado.id,
        poster_path: filmeSelecionado.poster_path,
      });
  
      setModalVisible(false);
      setModalSucesso(true);
    } catch (error: any) {
      setMensagemErro(error.message || "Erro ao adicionar filme.");
      setModalErro(true);
    }
  }  
  
  async function buscarPlataforma(id: string, tipo: "movie" | "tv"): Promise<string> {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${tipo}/${id}/watch/providers?api_key=${API_KEY}`
      );
      const data = await res.json();
      const br = data.results?.BR?.flatrate;
      return br?.[0]?.provider_name ?? "Desconhecido";
    } catch {
      return "Desconhecido";
    }
  }

  async function buscarPlataformas(id: string, tipo: "movie" | "tv") {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${tipo}/${id}/watch/providers?api_key=${API_KEY}`
      );
      const data = await res.json();
      const flatrate = data.results?.BR?.flatrate;
  
      if (Array.isArray(flatrate) && flatrate.length > 0) {
        const lista = flatrate.map((item: any) => ({
          nome: item.provider_name,
          logoUrl: `https://image.tmdb.org/t/p/original${item.logo_path}`,
        }));
        setPlataformas(lista);
      } else {
        setPlataformas([]);
      }
    } catch {
      setPlataformas([]);
    }
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.topo}>
        {filme.poster_path && (
          <TouchableOpacity onPress={() => router.push({ pathname: "/(tabs)/(home)/midiasFilme", params: { id } })}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${filme.poster_path}` }}
              style={styles.posterLateral}
            />
          </TouchableOpacity>
        )}
        <View style={styles.detalhesFilme}>
          <Text style={styles.title}>{filme.title}</Text>
          <Text style={styles.subtitle}>Lançamento: {filme.release_date}</Text>
          <Text style={styles.subtitle}>Popularidade: {filme.popularity.toFixed(1)}</Text>
          <Text style={styles.subtitle}>Nota: {filme.vote_average.toFixed(1)}</Text>
          <Text style={styles.subtitle}>Duração: {filme.runtime} min</Text>
        </View>
      </View>

      <Text style={styles.overview}>
        {filme.overview || "Sem descrição disponível."}
      </Text>

      <TouchableOpacity onPress={() => setExpandido(!expandido)} activeOpacity={0.8}>
        <View style={styles.cardOndeAssistir}>
        <View style={styles.tituloOndeAssistirContainer}>
          <Text style={styles.tituloOndeAssistir}>Onde assistir</Text>
          <Ionicons
            name={expandido ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color="#fff"
            style={{ marginLeft: 6 }}
          />
        </View>

          {plataformas.length > 0 ? (
            <View>
              {expandido ? (
                // Mostrar TODAS as plataformas
                <View style={styles.listaExpandida}>
                  {plataformas.map((p, i) => (
                    <View key={i} style={styles.plataformaItem}>
                      <Image source={{ uri: p.logoUrl }} style={styles.logoExpandido} />
                      <Text style={styles.nomeExpandido}>{p.nome}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                // Modo compacto
                <View style={styles.conteudoCard}>
                  <View style={styles.principal}>
                    <Image source={{ uri: plataformas[0].logoUrl }} style={styles.logoPrincipal} />
                    <View>
                      <Text style={styles.nomePrincipal}>{plataformas[0].nome}</Text>
                      <Text style={styles.tipoAcesso}>Assinatura</Text>
                    </View>
                  </View>

                  {plataformas.length > 1 && (
                    <View style={styles.outros}>
                      {plataformas.slice(1, 4).map((p, i) => (
                        <Image key={i} source={{ uri: p.logoUrl }} style={styles.logoMini} />
                      ))}
                      {plataformas.length > 4 && (
                        <Text style={styles.maisTexto}>Mais {plataformas.length - 4}</Text>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.naoDisponivel}>Não disponível para streaming no Brasil</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleAdicionarLista(filme)} // ou `serie`
        style={styles.botaoAdd}
      >
        <Text style={styles.botaoAddTexto}>+ Adicionar à Minha Lista</Text>
      </TouchableOpacity>


      <Text style={styles.sectionTitle}>Elenco</Text>
        <FlatList
          horizontal
          data={cast}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.castItem}>
              {item.profile_path ? (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` }}
                  style={styles.castImage}
                />
              ) : (
                <View style={[styles.castImage, { backgroundColor: "#333" }]} />
              )}
              <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.castCharacter} numberOfLines={1}>{item.character}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Escolha a nova prioridade</Text>

            <TouchableOpacity style={styles.modalBotao} onPress={() => salvarComPrioridade("alto")}>
              <Text style={styles.modalOpcao}>Prioridade Alta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBotao} onPress={() => salvarComPrioridade("medio")}>
              <Text style={styles.modalOpcao}>Prioridade Média</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBotao} onPress={() => salvarComPrioridade("baixo")}>
              <Text style={styles.modalOpcao}>Prioridade Baixa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalBotao, styles.botaoCancelar]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalOpcao, { color: "#999" }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={modalSucesso} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalSucesso(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>🎉 Sucesso</Text>
            <Text style={styles.modalMensagem}>Filme adicionado à sua lista!</Text>
            <TouchableOpacity style={[styles.modalBotao, styles.botaoCancelar]} onPress={() => setModalSucesso(false)}>
              <Text style={[styles.modalOpcao, { color: "#999" }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={modalErro} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalErro(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>❌ Erro</Text>
            <Text style={styles.modalMensagem}>{mensagemErro}</Text>
            <TouchableOpacity style={[styles.modalBotao, styles.botaoCancelar]} onPress={() => setModalErro(false)}>
              <Text style={[styles.modalOpcao, { color: "#999" }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 24,
    borderRadius: 12,
    width: "80%",
  },
  modalTitulo: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMensagem: {
    color: "#ccc",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  modalBotao: {
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  modalOpcao: {
    color: "#f90",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  botaoCancelar: {
    borderColor: "#333",
  },  
  tituloOndeAssistirContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },  
  listaExpandida: {
    marginTop: 12,
    gap: 10,
  },
  
  plataformaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  
  logoExpandido: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  
  nomeExpandido: {
    color: "#fff",
    fontSize: 14,
  },  
  cardOndeAssistir: {
    backgroundColor: "#1A1A1D",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  
  tituloOndeAssistir: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
  },
  
  conteudoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  principal: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  logoPrincipal: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  
  nomePrincipal: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  
  tipoAcesso: {
    color: "#ccc",
    fontSize: 13,
  },
  
  outros: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  
  logoMini: {
    width: 26,
    height: 26,
    borderRadius: 6,
  },
  
  maisTexto: {
    color: "#ccc",
    fontSize: 13,
    marginLeft: 6,
  },
  
  naoDisponivel: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 6,
  },  
  plataformaContainer: {
    marginTop: 16,
    marginBottom: 16,
    gap: 10,
  },
  logoPlataforma: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  plataformaTexto: {
    color: "#fff",
    fontSize: 15,
  },  
  botaoAdd: {
    backgroundColor: "#f90",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  botaoAddTexto: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },  
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  
  castItem: {
    marginRight: 12,
    width: 100,
    alignItems: "center",
  },
  
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
  },
  
  castName: {
    color: "#f90",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  
  castCharacter: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
  },  
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
  errorText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  topo: {
    flexDirection: "row",
    marginBottom: 24,
  },
  posterLateral: {
    width: 180,
    aspectRatio: 2 / 3,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  detalhesFilme: {
    flex: 1,
    justifyContent: "space-around",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f90",
    marginBottom: 8,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 4,
  },
  overview: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: "#1A1A1D",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
});
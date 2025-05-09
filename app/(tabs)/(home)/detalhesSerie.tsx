// Arquivo: nexum/app/(tabs)/(home)/detalhesSerie.tsx

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
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // ✅ IMPORTAÇÃO CORRETA
import { adicionarAMinhaListaFirestore } from "@/services/firestore";
import { auth } from "@/services/firebase";
import type { Prioridade } from "@/services/firestore";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "49283a14fc0026ef666878fda99ca3af";
const BASE_URL = "https://api.themoviedb.org/3";

export default function DetalhesSerieScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [serie, setSerie] = useState<any>(null);
  const [temporadaSelecionada, setTemporadaSelecionada] = useState<number | null>(null);
  const [episodios, setEpisodios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodios, setLoadingEpisodios] = useState(false);
  const [cast, setCast] = useState<any[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [expandido, setExpandido] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [serieSelecionada, setSerieSelecionada] = useState<any | null>(null);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  interface Plataforma {
    nome: string;
    logoUrl: string;
  }

  useEffect(() => {
    async function fetchSerie() {
      try {
        const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`);
        const data = await res.json();
        setSerie(data);
  
        await buscarPlataformas(data.id.toString());
  
        const creditRes = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=pt-BR`);
        const creditData = await creditRes.json();
        setCast(creditData.cast?.slice(0, 20) || []);
  
        if (data.seasons && data.seasons.length > 0) {
          const primeiraTemporada = data.seasons.find(
            (t: any) => t.season_number !== 0
          ) || data.seasons[0];
  
          if (primeiraTemporada?.season_number !== undefined) {
            fetchEpisodios(primeiraTemporada.season_number);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar série:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchSerie();
  }, [id]);
  

  async function buscarPlataformas(id: string) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${API_KEY}`
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
  
  async function fetchEpisodios(temporada: number) {
    setLoadingEpisodios(true);
    try {
      const res = await fetch(`${BASE_URL}/tv/${id}/season/${temporada}?api_key=${API_KEY}&language=pt-BR`);
      const data = await res.json();
      setEpisodios(data.episodes);
      setTemporadaSelecionada(temporada);
    } catch (error) {
      console.error("Erro ao buscar episódios:", error);
    } finally {
      setLoadingEpisodios(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f90" />
      </View>
    );
  }

  if (!serie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Série não encontrada.</Text>
      </View>
    );
  }

  function handleAdicionarLista(serie: any) {
    setSerieSelecionada(serie);
    setModalVisible(true);
  }

  async function salvarComPrioridade(prioridade: Prioridade) {
    if (!serieSelecionada) return;
    const usuario = auth.currentUser;
    if (!usuario) return;
  
    try {
      const plataforma = await buscarPlataforma(serieSelecionada.id.toString());
  
      await adicionarAMinhaListaFirestore(usuario.uid, {
        titulo: serieSelecionada.name,
        tipo: "Serie",
        plataforma,
        prioridade,
        tmdb_id: serieSelecionada.id,
        poster_path: serieSelecionada.poster_path,
      });
  
      setModalVisible(false);
      setModalSucesso(true);
    } catch (error: any) {
      setMensagemErro(error.message || "Erro ao adicionar série.");
      setModalErro(true);
    }
  }   
  
  async function buscarPlataforma(id: string): Promise<string> {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${API_KEY}`
      );
      const data = await res.json();
      const br = data.results?.BR?.flatrate;
      return br?.[0]?.provider_name ?? "Desconhecido";
    } catch {
      return "Desconhecido";
    }
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.topo}>
        {serie.poster_path && (
            <TouchableOpacity onPress={() => router.push({ pathname: "/(tabs)/(home)/postersSerie", params: { id } })}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${serie.poster_path}` }}
              style={styles.posterLateral}
            />
          </TouchableOpacity>
        )}
        <View style={styles.detalhesSerie}>
            <Text style={styles.title}>{serie.name}</Text>
            <Text style={styles.subtitle}>Estreia: {serie.first_air_date}</Text>
            <Text style={styles.subtitle}>Popularidade: {serie.popularity.toFixed(1)}</Text>
            <Text style={styles.subtitle}>Nota: {serie.vote_average.toFixed(1)}</Text>
        </View>
        </View>

      <Text style={styles.overview}>
        {serie.overview || "Sem descrição disponível."}
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
                <View style={styles.listaExpandida}>
                  {plataformas.map((p, i) => (
                    <View key={i} style={styles.plataformaItem}>
                      <Image source={{ uri: p.logoUrl }} style={styles.logoExpandido} />
                      <Text style={styles.nomeExpandido}>{p.nome}</Text>
                    </View>
                  ))}
                </View>
              ) : (
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
        style={styles.botaoAdd}
        onPress={() => handleAdicionarLista(serie)}
        >
        <Text style={styles.botaoAddTexto}>+ Adicionar à Minha Lista</Text>
      </TouchableOpacity>



      <Text style={styles.sectionTitle}>Elenco</Text>
      <FlatList
        horizontal
        data={cast}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.castItem}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/detalhesElenco",
                params: {
                  id: item.id.toString(),
                  midiaId: serie.id.toString(), // ou `serie.id.toString()`
                  tipo: "tv", // ou "tv" dependendo do tipo de conteúdo atual
                },
              })
            }
          >
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
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />


      <Text style={styles.sectionTitle}>Temporadas</Text>
      <FlatList
        horizontal
        data={serie.seasons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.seasonButton,
              item.season_number === temporadaSelecionada && styles.seasonButtonActive,
            ]}
            onPress={() => fetchEpisodios(item.season_number)}
          >
            <Text
              style={[
                styles.seasonButtonText,
                item.season_number === temporadaSelecionada && styles.seasonButtonTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {temporadaSelecionada !== null && (
        <>
          <Text style={styles.sectionTitle}>Episódios</Text>
          {loadingEpisodios ? (
            <ActivityIndicator size="small" color="#f90" />
          ) : (
            episodios.map((ep) => (
                <View key={ep.id} style={styles.episodioCard}>
                  {ep.still_path ? (
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w780${ep.still_path}` }}
                      style={styles.episodioImagem}
                    />
                  ) : (
                    <View style={[styles.episodioImagem, { backgroundColor: "#333" }]} />
                  )}
              
                  <View style={styles.episodioConteudo}>
                    <Text style={styles.episodioTitulo}>
                      {ep.episode_number}. {ep.name}
                    </Text>
                    <Text style={styles.episodioData}>
                      Lançado em: {ep.air_date || "Data desconhecida"}
                    </Text>
                    <Text style={styles.episodioDescricao}>
                      {ep.overview || "Sem descrição disponível."}
                    </Text>
                  </View>
                </View>
              ))                            
          )}
        </>
      )}
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
            <Text style={styles.modalMensagem}>Série adicionada à sua lista!</Text>
            <TouchableOpacity
              style={[styles.modalBotao, styles.botaoCancelar]}
              onPress={() => setModalSucesso(false)}
            >
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
            <TouchableOpacity
              style={[styles.modalBotao, styles.botaoCancelar]}
              onPress={() => setModalErro(false)}
            >
              <Text style={[styles.modalOpcao, { color: "#999" }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalMensagem: {
    color: "#ccc",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },  
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
  cardOndeAssistir: {
    backgroundColor: "#1A1A1D",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tituloOndeAssistirContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tituloOndeAssistir: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
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

  // TOPO COM POSTER + INFOS
  topo: {
    flexDirection: "row",
    marginBottom: 24,
  },

  posterLateral: {
    width: 180,
    height: undefined,
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

  detalhesSerie: {
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

  // OVERVIEW
  overview: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: "#1A1A1D",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },

  // SECTIONS
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 12,
  },

  // BOTÕES DE TEMPORADA
  seasonButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#2a2a2d",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
  },

  seasonButtonActive: {
    backgroundColor: "#f90",
    borderColor: "#f90",
  },

  seasonButtonText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "500",
  },

  seasonButtonTextActive: {
    color: "#000",
    fontWeight: "bold",
  },

  // EPISÓDIOS
  episodioCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  episodioImagem: {
    width: "100%",
    height: 180,
  },

  episodioConteudo: {
    padding: 14,
  },

  episodioTitulo: {
    color: "#f90",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  episodioData: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 6,
  },

  episodioDescricao: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
});
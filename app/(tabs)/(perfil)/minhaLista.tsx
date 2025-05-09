import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  Modal,
} from "react-native";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useRouter, useFocusEffect } from "expo-router";
import { auth, db } from "@/services/firebase";
import { Ionicons } from "@expo/vector-icons";

export default function MinhaListaScreen() {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<any | null>(null);

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      async function buscarLista() {
        try {
          const usuario = auth.currentUser;
          if (!usuario) return;

          const snap = await getDocs(collection(db, "usuarios", usuario.uid, "minhaLista"));
          const dados = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLista(dados);
        } catch (error) {
          console.error("Erro ao buscar lista:", error);
          setLista([]);
        } finally {
          setLoading(false);
        }
      }

      buscarLista();
    }, [])
  );

  async function excluirItem(id: string) {
    const usuario = auth.currentUser;
    if (!usuario) return;

    await deleteDoc(doc(db, "usuarios", usuario.uid, "minhaLista", id));
    setLista((prev) => prev.filter((item) => item.id !== id));
  }

  function abrirAlterarPrioridade(item: any) {
    setItemSelecionado(item);
    setModalVisible(true);
  }

  async function atualizarPrioridade(nova: string) {
    if (!itemSelecionado) return;
    const usuario = auth.currentUser;
    if (!usuario) return;

    const ref = doc(db, "usuarios", usuario.uid, "minhaLista", itemSelecionado.id);
    await updateDoc(ref, { prioridade: nova });

    setLista((prev) =>
      prev.map((item) =>
        item.id === itemSelecionado.id ? { ...item, prioridade: nova } : item
      )
    );
    setModalVisible(false);
  }

  function navegarParaDetalhes(item: any) {
    if (!item.tmdb_id) return;
    router.push({
      pathname:
        item.tipo === "Filme"
          ? "/(tabs)/(home)/detalhesFilme"
          : "/(tabs)/(home)/detalhesSerie",
      params: { id: item.tmdb_id.toString() },
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.tituloContainer}>
        <TouchableOpacity onPress={() => router.push("../(perfil)")}>
          <Ionicons name="arrow-back" size={28} color="#f90" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Minha Lista</Text>
      </View>


      {lista.length === 0 ? (
        <Text style={styles.empty}>Nenhum item salvo ainda.</Text>
      ) : (
        lista.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navegarParaDetalhes(item)}
            style={styles.card}
          >
            <Image
              source={{
                uri: item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : "https://via.placeholder.com/100x150?text=Sem+Imagem",
              }}
              style={styles.poster}
            />

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{item.titulo}</Text>
              <Text style={styles.cardDetalhes}>Tipo: {item.tipo}</Text>
              <Text style={styles.cardDetalhes}>Plataforma: {item.plataforma}</Text>
              <Text style={styles.cardPrioridade}>
                {item.prioridade === "alto"
                  ? "Prioridade Alta"
                  : item.prioridade === "medio"
                  ? "Prioridade Média"
                  : "Prioridade Baixa"}
              </Text>

              <View style={styles.botoesContainer}>
                <TouchableOpacity
                  style={styles.botaoPrioridade}
                  onPress={() => abrirAlterarPrioridade(item)}
                >
                  <Text style={styles.botaoTexto}>Alterar Prioridade</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoExcluir}
                  onPress={() => excluirItem(item.id)}
                >
                  <Text style={styles.botaoTexto}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Escolha a nova prioridade</Text>

            <TouchableOpacity style={styles.modalBotao} onPress={() => atualizarPrioridade("alto")}>
              <Text style={styles.modalOpcao}>Prioridade Alta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBotao} onPress={() => atualizarPrioridade("medio")}>
              <Text style={styles.modalOpcao}>Prioridade Média</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBotao} onPress={() => atualizarPrioridade("baixo")}>
              <Text style={styles.modalOpcao}>Prioridade Baixa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalBotao, styles.botaoCancelar]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalOpcao, { color: "#999" }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tituloContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },  
  titulo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop:18
  },
  modalBotao: {
    borderWidth: 1,
    borderColor: "#f90",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
  },
  modalOpcao: {
    color: "#f90",
    fontSize: 14,
    fontWeight: "500",
  },  
  botaoCancelar: {
    borderColor: "#444",
  },  
  botaoVoltar: {
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f90",
  },
  botaoVoltarTexto: {
    color: "#f90",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#111",
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#222",
    flexDirection: "row",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 6,
    marginRight: 14,
    backgroundColor: "#333",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f90",
    marginBottom: 6,
  },
  cardDetalhes: {
    color: "#ccc",
    fontSize: 14,
  },
  streamingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  logoStreaming: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  cardPrioridade: {
    color: "#f90",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 4,
  },
  botoesContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  botaoPrioridade: {
    backgroundColor: "#444",
    padding: 8,
    borderRadius: 6,
  },
  botaoExcluir: {
    backgroundColor: "#900",
    padding: 8,
    borderRadius: 6,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
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
  },
});
// Arquivo: nexum/app/(tabs)/(programacao)/index.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTmdb } from "../../../contexts/TmdbContext";

const STREAMINGS = [
  { nome: "Netflix", id: 8, logo: require("@/assets/images/netflixlogo.png") },
  { nome: "Prime Video", id: 119, logo: require("@/assets/images/primevideo.png") },
  { nome: "Disney+", id: 337, logo: require("@/assets/images/disneylogo.png") },
];

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // URL para imagens dos filmes/séries

export default function Programacao() {
  const { movies, series, loading, streamingSelecionado } = useTmdb();
  const [programacaoPorDia, setProgramacaoPorDia] = useState<Record<string, any[]>>({});
  const [diaSelecionado, setDiaSelecionado] = useState("Segunda");

  useEffect(() => {
    if (!loading) {
      type DiaSemana = "Segunda" | "Terca" | "Quarta" | "Quinta" | "Sexta" | "Sabado" | "Domingo";

      const novosHorarios: Record<DiaSemana, string[]> = {
        Segunda: ["08:00", "12:00", "18:00", "21:00"],
        Terca: ["09:00", "13:00", "17:00", "20:00"],
        Quarta: ["10:00", "14:00", "19:00", "22:00"],
        Quinta: ["08:30", "11:30", "16:00", "21:30"],
        Sexta: ["07:00", "12:30", "17:30", "20:30"],
        Sabado: ["09:30", "14:30", "19:30", "22:30"],
        Domingo: ["10:30", "15:30", "18:30", "21:00"],
      };

      const conteudos = [...movies.slice(0, 5), ...series.slice(0, 5)];

      const novaProgramacao: Record<string, any[]> = {};

      (Object.keys(novosHorarios) as DiaSemana[]).forEach((dia) => {
        novaProgramacao[dia] = conteudos.slice(0, novosHorarios[dia].length).map((conteudo, index) => ({
          horario: novosHorarios[dia][index],
          titulo: conteudo.title || conteudo.name,
          posterPath: conteudo.poster_path,
          plataforma: STREAMINGS.find((s) => s.id === streamingSelecionado)?.nome || "Outro",
          logo: STREAMINGS.find((s) => s.id === streamingSelecionado)?.logo,
          duracao: conteudo.runtime ? `${conteudo.runtime} min` : "2h",
        }));
      });

      setProgramacaoPorDia(novaProgramacao);
    }
  }, [loading, movies, series, streamingSelecionado]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f90" />
      </View>
    );
  }

  const programacao = programacaoPorDia[diaSelecionado] || [];

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Programação</Text>

      {/* Filtros - Dias da semana */}
      <View style={styles.diasContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.diasContent}
        >
          {DIAS_SEMANA.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={dia === diaSelecionado ? styles.filtroAtivo : styles.filtro}
              onPress={() => setDiaSelecionado(dia)}
            >
              <Text style={dia === diaSelecionado ? styles.filtroAtivoTexto : styles.filtroTexto}>
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de programação */}
      <ScrollView style={styles.lista}>
        {programacao.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.horario}>{item.horario}</Text>
            <View style={styles.cardConteudo}>
              <View style={{ flex: 1 }}>
                <View style={styles.tituloContainer}>
                  {item.posterPath && (
                    <Image
                      source={{ uri: `${IMAGE_BASE_URL}${item.posterPath}` }}
                      style={styles.poster}
                    />
                  )}
                  <Text style={styles.titulo}>{item.titulo}</Text>
                </View>

                <View style={styles.plataforma}>
                  {item.logo && <Image source={item.logo} style={styles.logo} />}
                  <Text style={styles.plataformaTexto}>{item.plataforma}</Text>
                </View>
              </View>

              <View style={styles.infoExtra}>
                <TouchableOpacity>
                  <Text style={styles.editar}>Editar</Text>
                </TouchableOpacity>
                <Text style={styles.duracao}>{item.duracao}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.cardVazio}>
          <Text style={styles.horario}>20:00</Text>
        </View>
      </ScrollView>

      {/* Botão flutuante */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={32} color="#111111" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  diasContainer: {
    height: 60,
    marginBottom: 12,
  },
  diasContent: {
    alignItems: "center",
  },
  filtro: {
    height: 40,
    minWidth: 80,
    backgroundColor: "#333",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginRight: 8,
  },
  filtroTexto: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "500",
  },
  filtroAtivo: {
    height: 40,
    minWidth: 80,
    backgroundColor: "#f90",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginRight: 8,
  },
  filtroAtivoTexto: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  lista: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  horario: {
    color: "#fff",
    fontSize: 16,
    width: 60,
    marginTop: 12,
  },
  cardConteudo: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "#2a2a2d",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  tituloContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  poster: {
    width: 40,
    height: 60,
    borderRadius: 6,
    resizeMode: "cover",
  },
  titulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  plataforma: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  logo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  plataformaTexto: {
    color: "#ccc",
    fontSize: 13,
  },
  infoExtra: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  editar: {
    color: "#4D8BFF",
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 13,
  },
  duracao: {
    color: "#bbb",
    fontSize: 13,
  },
  cardVazio: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#f90",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },
});

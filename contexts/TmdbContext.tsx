// Arquivo: nexum/contexts/TmdbContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { View, ActivityIndicator } from "react-native";

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

interface TmdbContextData {
  movies: any[];
  series: any[];
  loading: boolean;
  streamingSelecionado: number;
  setStreamingSelecionado: (id: number) => void;
}

const TmdbContext = createContext<TmdbContextData>({} as TmdbContextData);

export function TmdbProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [streamingSelecionado, setStreamingSelecionado] = useState(STREAMINGS[0].id);

  useEffect(() => {
    async function fetchConteudos() {
      setLoading(true);
      try {
        const filmesRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&language=pt-BR&watch_region=BR&with_watch_providers=${streamingSelecionado}`,
          API_OPTIONS
        );
        const filmesData = await filmesRes.json();

        const seriesRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&language=pt-BR&watch_region=BR&with_watch_providers=${streamingSelecionado}`,
          API_OPTIONS
        );
        const seriesData = await seriesRes.json();

        setMovies(filmesData.results);
        setSeries(seriesData.results);
      } catch (error) {
        console.error("Erro ao buscar conteúdos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConteudos();
  }, [streamingSelecionado]);

  return (
    <TmdbContext.Provider
      value={{ movies, series, loading, streamingSelecionado, setStreamingSelecionado }}
    >
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" }}>
          <ActivityIndicator size="large" color="#f90" />
        </View>
      ) : (
        children
      )}
    </TmdbContext.Provider>
  );
}

export function useTmdb() {
  return useContext(TmdbContext);
}

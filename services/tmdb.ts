// Arquivo: nexum/services/tmdb.ts

import axios from "axios";

const API_KEY = "49283a14fc0026ef666878fda99ca3af"; // 👉 Sua chave
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "pt-BR",
  },
});

// Buscar filmes populares (padrão)
export async function getPopularMovies() {
  const response = await api.get("/movie/popular");
  return response.data.results;
}

// Buscar séries populares (padrão)
export async function getPopularSeries() {
  const response = await api.get("/tv/popular");
  return response.data.results;
}

// 🔥 NOVO: Buscar filmes por gênero e provedor (streaming)
export async function getMoviesByGenreAndProvider(genreId: number, providerId: number) {
  const response = await api.get("/discover/movie", {
    params: {
      with_genres: genreId,
      with_watch_providers: providerId,
      watch_region: "BR",
      sort_by: "popularity.desc",
    },
  });
  return response.data.results;
}

// Busca séries por gênero e provedor
export async function getSeriesByGenreAndProvider(genreId: number, providerId?: number) {
  const params: any = {
    with_genres: genreId,
    sort_by: "popularity.desc",
    language: "pt-BR",
    watch_region: "BR",
  };

  if (providerId) {
    params.with_watch_providers = providerId;
  }

  const response = await api.get("/discover/tv", { params });
  return response.data.results;
}


// Arquivo: nexum/services/tmdb.ts

// 🔥 Buscar filmes pelo nome (busca normal)
export async function searchMovies(query: string) {
  const response = await api.get("/search/movie", {
    params: {
      query,
    },
  });
  return response.data.results;
}

// 🔍 Buscar séries pelo nome
export async function searchSeries(query: string) {
  const response = await api.get("/search/tv", {
    params: {
      query,
    },
  });
  return response.data.results;
}


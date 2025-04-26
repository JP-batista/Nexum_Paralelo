// Arquivo: nexum/services/tmdb.ts

import axios from "axios";

const API_KEY = "49283a14fc0026ef666878fda99ca3af"; // 👉 Sua chave oficial
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "pt-BR", // Podemos mudar para "en-US" se quiser inglês
  },
});

export async function getPopularMovies() {
  const response = await api.get("/movie/popular");
  return response.data.results;
}

export async function getPopularSeries() {
  const response = await api.get("/tv/popular");
  return response.data.results;
}

// Podemos adicionar depois: buscar filmes por gênero, trending, recomendações, etc

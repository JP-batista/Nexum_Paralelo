import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

/* ============================
   👤 Criar usuário no Firestore
============================ */

export async function criarUsuarioFirestore(idUsuario: string, nome: string, email: string) {
  await setDoc(doc(db, "usuarios", idUsuario), {
    nome,
    email,
    fotoPerfil: "padrao", // avatar padrão ao criar conta
  });
}

/* ============================
   ⭐️ Tipos para lista pessoal
============================ */

export type Prioridade = "alto" | "medio" | "baixo";
export type Tipo = "Filme" | "Serie";

export interface ItemLista {
  titulo: string;
  tipo: Tipo;
  plataforma: string;
  prioridade: Prioridade;
  tmdb_id: number;
  poster_path: string;
}

/* ===================================
   ➕ Adicionar item à lista do usuário
=================================== */

export async function adicionarAMinhaListaFirestore(idUsuario: string, item: ItemLista) {
  const ref = collection(db, "usuarios", idUsuario, "minhaLista");

  const q = query(ref, where("tmdb_id", "==", item.tmdb_id));
  const snap = await getDocs(q);

  if (!snap.empty) {
    throw new Error("Este item já está na sua lista.");
  }

  await addDoc(ref, item);
}

/* ===============================
   🎯 Preferências do usuário
=============================== */

export interface PreferenciasUsuario {
  generoFavorito: string;
  filmeFavorito: string;
  seriadoFavorito: string;
  streaming: string;
}

export async function salvarPreferenciasUsuario(idUsuario: string, preferencias: PreferenciasUsuario) {
  const ref = doc(db, "usuarios", idUsuario, "preferencias", "dados");
  await setDoc(ref, preferencias);
}

export async function buscarPreferenciasUsuario(idUsuario: string): Promise<PreferenciasUsuario | null> {
  const ref = doc(db, "usuarios", idUsuario, "preferencias", "dados");
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as PreferenciasUsuario;
  } else {
    return null;
  }
}

/* ===================================
   📸 Atualizar avatar do usuário
=================================== */

export async function atualizarFotoPerfil(idUsuario: string, nomeAvatar: string) {
  const ref = doc(db, "usuarios", idUsuario);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const dadosAtuais = snap.data();
    await setDoc(ref, { ...dadosAtuais, fotoPerfil: nomeAvatar });
  }
}

/* ===================================
   🔍 Buscar dados do usuário
=================================== */

export interface UsuarioData {
  nome: string;
  email: string;
  fotoPerfil: string;
  phoneNumber?: string;
}

export async function buscarUsuarioFirestore(idUsuario: string): Promise<UsuarioData | null> {
  const ref = doc(db, "usuarios", idUsuario);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UsuarioData;
  } else {
    return null;
  }
}

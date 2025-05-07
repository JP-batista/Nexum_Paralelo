import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export async function criarUsuarioFirestore(idUsuario: string, nome: string, email: string) {
  await setDoc(doc(db, "usuarios", idUsuario), {
    nome,
    email,
  });
}

type Prioridade = "alto" | "medio" | "baixo";
type Tipo = "Filme" | "Serie";

interface ItemLista {
  titulo: string;
  tipo: Tipo;
  plataforma: string;
  prioridade: Prioridade;
  tmdb_id: number;
  poster_path: string;
}

export async function adicionarAMinhaListaFirestore(idUsuario: string, item: ItemLista) {
  const ref = collection(db, "usuarios", idUsuario, "minhaLista");

  const q = query(ref, where("tmdb_id", "==", item.tmdb_id));
  const snap = await getDocs(q);

  if (!snap.empty) {
    throw new Error("Este item já está na sua lista.");
  }

  await addDoc(ref, item);
}

interface PreferenciasUsuario {
  generoFavorito: string;
  filmeFavorito: string;
  seriadoFavorito: string;
  streaming: string; // Nova preferência adicionada
}

export async function salvarPreferenciasUsuario(idUsuario: string, preferencias: PreferenciasUsuario) {
  const ref = doc(db, "usuarios", idUsuario, "preferencias", "dados"); // Corrigido
  await setDoc(ref, preferencias);
}


export async function buscarPreferenciasUsuario(idUsuario: string): Promise<PreferenciasUsuario | null> {
  const ref = doc(db, "usuarios", idUsuario, "preferencias", "dados"); // Corrigido
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as PreferenciasUsuario;
  } else {
    return null;
  }
}


export type { Prioridade, Tipo, ItemLista, PreferenciasUsuario };

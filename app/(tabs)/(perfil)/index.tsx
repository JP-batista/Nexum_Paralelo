// Arquivo: nexum/app/(tabs)/(perfil)/index.tsx

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../services/firebase";
import { useRouter, useFocusEffect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { buscarPreferenciasUsuario, PreferenciasUsuario } from "../../../services/firestore";
import { Image } from "react-native";
import { AVATARES } from "@/assets/utils/avatars"; // ajuste o caminho se necessário

export default function PerfilScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [preferencias, setPreferencias] = useState<PreferenciasUsuario | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchUserData() {
        if (user) {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }

          const preferenciasData = await buscarPreferenciasUsuario(user.uid);
          setPreferencias(preferenciasData);
        }
      }
      fetchUserData();
    }, [user])
  );

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Image
        source={
          userData?.fotoPerfil && userData.fotoPerfil !== "padrao"
            ? AVATARES.find((a) => a.nome === userData.fotoPerfil)?.path || require("@/assets/images/avatares/padrao.png")
            : require("@/assets/images/avatares/padrao.png")
        }
        style={styles.avatar}
      />

      <Text style={styles.title}>
        {userData?.nome || "Usuário"}
      </Text>

      {/* Informações Pessoais */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>

        {(userData?.email || user?.email) && (
          <View style={styles.infoItem}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <Text style={styles.value}>{userData?.email ?? user?.email}</Text>
          </View>
        )}

        {userData?.phoneNumber && (
          <View style={styles.infoItem}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <Text style={styles.value}>{userData.phoneNumber}</Text>
          </View>
        )}
      </View>

      {/* Preferências */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Preferências</Text>

        {preferencias ? (
          <>
            <View style={styles.infoItem}>
              <Ionicons
                name="heart-outline"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
              <Text style={styles.value}>Gênero favorito: {preferencias.generoFavorito}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name="film-outline"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
              <Text style={styles.value}>Filme favorito: {preferencias.filmeFavorito}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name="tv-outline"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
              <Text style={styles.value}>Seriado favorito: {preferencias.seriadoFavorito}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons
                  name="play-outline"
                  size={20}
                  color="#aaa"
                  style={styles.icon}
                />
              <Text style={styles.value}>Streaming de Preferência: {preferencias.streaming}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.value}>Nenhuma preferência cadastrada ainda.</Text>
        )}
      </View>

      {/* Botões */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/(tabs)/(perfil)/editar")}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.myListButton}
        onPress={() => router.push("/(tabs)/(perfil)/minhaLista")}
      >
        <Text style={styles.myListButtonText}>Minha Lista</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.myListButton}
        onPress={() => router.push("/(tabs)/(perfil)/preferencias")}
      >
        <Text style={styles.myListButtonText}>Preferências</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#f90",
    marginBottom: 16,
  },
  
  container: {
    flexGrow: 1,
    backgroundColor: "#111",
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f90",
    marginBottom: 32,
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f90",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: "#fff",
  },
  editButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  myListButton: {
    backgroundColor: "#555",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  myListButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#f90",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  logoutButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

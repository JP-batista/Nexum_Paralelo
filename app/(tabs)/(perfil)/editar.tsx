// Arquivo: nexum/app/(tabs)/perfil/editar.tsx

import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../services/firebase";
import { updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";

export default function EditarPerfilScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialLinks, setSocialLinks] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setDisplayName(data.displayName || "");
            setPhoneNumber(data.phoneNumber || "");
            setSocialLinks(data.socialLinks || ["", "", ""]);
          } else {
            setDisplayName(user.displayName || "");
            setPhoneNumber("");
            setSocialLinks(["", "", ""]);
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      }
    }
    fetchProfile();
  }, [user]);

  async function handleSave() {
    if (!displayName.trim()) {
      Alert.alert("Erro", "O nome não pode ficar vazio.");
      return;
    }

    try {
      setLoading(true);

      // Atualizar nome no Auth (user profile)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
      }

      // Atualizar também no Firestore
      await setDoc(doc(db, "users", user!.uid), {
        uid: user!.uid,
        email: user!.email,
        displayName: displayName,
        phoneNumber: phoneNumber,
        socialLinks: socialLinks.filter(link => link.trim() !== ""), // remove links vazios
      });

      Alert.alert("Sucesso", "Perfil atualizado!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  function updateSocialLink(index: number, value: string) {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#aaa"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor="#aaa"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Campos de Links de Redes Sociais */}
      {socialLinks.map((link, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Link de Rede Social ${index + 1}`}
          placeholderTextColor="#aaa"
          value={link}
          onChangeText={(text) => updateSocialLink(index, text)}
        />
      ))}

      {loading ? (
        <ActivityIndicator size="large" color="#f90" style={{ marginVertical: 16 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f90",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    color: "#fff",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#f90",
    borderRadius: 8,
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

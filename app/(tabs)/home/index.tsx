// Arquivo: nexum/app/(tabs)/home/index.tsx

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../services/firebase";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Nexum 👋</Text>
      
      <Text style={styles.name}>
        {user?.displayName 
          ? `Usuário: ${user.displayName}` 
          : `Usuário: ${user?.email}`}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f90",
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    color: "#ccc",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#f90",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

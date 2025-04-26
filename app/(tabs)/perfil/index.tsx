import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../services/firebase";
import { useRouter, useFocusEffect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useCallback } from "react";

export default function PerfilScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchUserData() {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
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

  function detectSocialIcon(link: string) {
    if (link.includes("instagram.com")) {
      return <FontAwesome name="instagram" size={24} color="#f90" />;
    }
    if (link.includes("twitter.com")) {
      return <FontAwesome name="twitter" size={24} color="#1DA1F2" />;
    }
    if (link.includes("linkedin.com")) {
      return <FontAwesome name="linkedin" size={24} color="#0077b5" />;
    }
    return <Ionicons name="link-outline" size={24} color="#ccc" />;
  }

  function detectSocialName(link: string) {
    if (link.includes("instagram.com")) return "Instagram";
    if (link.includes("twitter.com")) return "Twitter";
    if (link.includes("linkedin.com")) return "LinkedIn";
    return "Rede Social";
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{userData?.displayName || user?.displayName || "Usuário"}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>

        {userData?.email && (
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.icon} />
            <Text style={styles.value}>{userData.email}</Text>
          </View>
        )}

        {userData?.phoneNumber && (
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color="#aaa" style={styles.icon} />
            <Text style={styles.value}>{userData.phoneNumber}</Text>
          </View>
        )}

        {userData?.socialLinks?.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Redes Sociais</Text>
            {userData.socialLinks.map((link: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.socialItem}
                onPress={() => Linking.openURL(link)}
              >
                {detectSocialIcon(link)}
                <Text style={styles.socialText}>{detectSocialName(link)}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => router.push("/(tabs)/perfil/editar")}>
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: "#fff",
  },
  socialText: {
    fontSize: 16,
    color: "#f90",
    marginLeft: 8,
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

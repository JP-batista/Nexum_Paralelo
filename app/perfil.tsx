import { useRouter } from "expo-router";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function Perfil() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Imagem do perfil */}
      <Image 
        source={require("../src/assets/images/perfil.png")}
        style={styles.profileImage} 
      />

      {/* Nome do usuário */}
      <Text style={styles.userName}>Nome do Usuário</Text>

      {/* Email */}
      <Text style={styles.email}>usuario@email.com</Text>


      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
        <Text style={styles.backButtonText}>Voltar para Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1D",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f90",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: "#f90",
    fontSize: 16,
  },
});

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import Logo from "@/assets/images/logo.png";
import { Ionicons } from "@expo/vector-icons"; // 👈 Importar o ícone de olho

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Estado para mostrar/ocultar senha

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Email ou senha incorretos!");
    }
  }

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />

      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Campo de senha com olhinho */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.link}>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  form: {
    marginTop: 160,
  },
  title: {
    fontSize: 28,
    color: "#f90",
    fontWeight: "bold",
    marginBottom: 24,
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
  passwordContainer: {
    backgroundColor: "#222",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    color: "#fff",
  },
  button: {
    backgroundColor: "#f90",
    borderRadius: 8,
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#f90",
    fontSize: 14,
    textAlign: "center",
  },
});

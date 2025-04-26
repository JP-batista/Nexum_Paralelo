import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useRouter } from "expo-router";
import Logo from "@/assets/images/logo.png";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleRegister() {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      router.replace("/home");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Erro", "Este e-mail já está cadastrado.");
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta.");
      }
    }
  }

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />

      <View style={styles.form}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirmar Senha"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
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
    marginTop: 40,
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
    marginBottom: 16, // espaço extra antes do link
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

// Arquivo: nexum/app/(auth)/login.tsx

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable  } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import Logo from "@/assets/images/logo.png"; // Importa a logo
import { sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalErro, setModalErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setMensagemErro("Preencha todos os campos!");
      setModalErro(true);
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/(home)");
    } catch (error: any) {
      console.error(error);
      setMensagemErro("Email ou senha incorretos!");
      setModalErro(true);
    }
  } 

  async function handleEsqueciSenha() {
    if (!email) {
      setMensagemErro("Informe seu e-mail para redefinir a senha.");
      setModalErro(true);
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      setMensagemErro("Enviamos um link de redefinição para seu e-mail.");
      setModalErro(true);
    } catch (error: any) {
      setMensagemErro("Erro ao enviar e-mail de redefinição.");
      setModalErro(true);
    }
  }

  
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />

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

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputComIcone}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconWrapper}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      
      <View style={styles.esqueciSenha}>
        <TouchableOpacity onPress={handleEsqueciSenha}>
          <Text style={styles.esqueciSenha}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.link}>Criar uma conta</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalErro} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalErro(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMensagem}>{mensagemErro}</Text>
            <TouchableOpacity
              style={[styles.modalBotao, styles.botaoCancelar]}
              onPress={() => setModalErro(false)}
            >
              <Text style={[styles.modalOpcao, { color: "#999" }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  
  inputComIcone: {
    flex: 1,
    color: "#fff",
  },
  
  iconWrapper: {
    marginLeft: 8,
  },  
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 24,
    borderRadius: 12,
    width: "80%",
  },
  modalMensagem: {
    color: "#ccc",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  modalBotao: {
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  modalOpcao: {
    color: "#f90",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  botaoCancelar: {
    borderColor: "#333",
  },  
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 160,
  },
  title: {
    fontSize: 28,
    color: "#f90",
    fontWeight: "bold",
    marginBottom: 24,
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
  button: {
    backgroundColor: "#f90",
    borderRadius: 8,
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#f90",
    marginTop: 16,
  },
  esqueciSenha: {
    color: "#f90",
    marginTop: 0,
    alignSelf: "flex-end",
    margin: 4,
  },  
});

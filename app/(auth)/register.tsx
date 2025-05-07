// Arquivo: nexum/app/(auth)/register.tsx

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Pressable  } from "react-native";
import { auth } from "../../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@/assets/images/logo.png"; // Importa a logo
import { criarUsuarioFirestore } from "@/services/firestore"

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  async function handleRegister() {
    if (!email || !password || !confirmPassword || !name) {
      setMensagemErro("Preencha todos os campos!");
      setModalErro(true);
      return;
    }
  
    if (password !== confirmPassword) {
      setMensagemErro("As senhas não coincidem!");
      setModalErro(true);
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: name,
      });
  
      try {
        await criarUsuarioFirestore(user.uid, name, email);
      } catch (firestoreError) {
        console.error("Erro ao criar usuário no Firestore:", firestoreError);
        setMensagemErro("Não foi possível salvar as informações no banco de dados.");
        setModalErro(true);
        return;
      }
  
      router.replace("/(tabs)/(home)");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      if (error.code === "auth/email-already-in-use") {
        setMensagemErro("Este e-mail já está cadastrado.");
      } else {
        setMensagemErro("Não foi possível criar a conta.");
      }
      setModalErro(true);
    }
  }  

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  function toggleShowConfirmPassword() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />

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
        <TouchableOpacity onPress={toggleShowPassword}>
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
        <TouchableOpacity onPress={toggleShowConfirmPassword}>
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

      <Modal transparent visible={modalErro} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalErro(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>❌ Erro</Text>
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
  modalTitulo: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
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
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 80,
  },
  title: {
    fontSize: 28,
    color: "#f90",
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
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
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#f90",
    textAlign: "center",
    marginTop: 16,
  },
});

import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Input from "../src/components/Input";
import SocialLogin from "../src/components/SocialLogin";
import CheckBox from "expo-checkbox";

export default function AuthScreen() {
  const [modo, setModo] = useState<"inicio" | "login" | "cadastro">("inicio");
  const [termos, setTermos] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.top}>
        <TouchableOpacity onPress={() => setModo("inicio")}>
          <Image
            source={require("../src/assets/images/logo.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>

      {/* Conteúdo do meio */}
      <View style={styles.middle}>
        {/* Login */}
        {modo === "login" && (
          <>
            <Input placeholder="Email" placeholderTextColor="#aaa" />
            <Input placeholder="Senha" secure placeholderTextColor="#aaa" />
            <TouchableOpacity style={styles.button} onPress={() => router.push("/perfil")}>
      <Text style={styles.buttonText}>Entrar</Text>
    </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.or}>Ou continue com</Text>
              <View style={styles.line} />
            </View>

            <SocialLogin />
          </>
        )}

        {/* Cadastro */}
        {modo === "cadastro" && (
          <>
            <Input placeholder="Nome" placeholderTextColor="#aaa" />
            <Input placeholder="Email" placeholderTextColor="#aaa" />
            <Input placeholder="Senha" secure placeholderTextColor="#aaa" />
            <Input placeholder="Confirmar Senha" secure placeholderTextColor="#aaa" />

            <View style={styles.checkboxContainer}>
              <CheckBox value={termos} onValueChange={setTermos} color="#f90" />
              <Text style={styles.checkboxLabel}>
                Eu li e concordo com os termos de uso
              </Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Criar conta</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.or}>Ou continue com</Text>
              <View style={styles.line} />
            </View>

            <SocialLogin />
          </>
        )}

        {/* Tela inicial */}
        {modo === "inicio" && (
          <>
            <TouchableOpacity style={styles.button} onPress={() => setModo("cadastro")}>
              <Text style={styles.buttonText}>Criar conta</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.or}>Ou continue com</Text>
              <View style={styles.line} />
            </View>

            <SocialLogin />
          </>
        )}
      </View>

      {/* Rodapé */}
      <View style={styles.bottom}>
        {modo === "inicio" && (
          <TouchableOpacity onPress={() => setModo("login")}>
            <Text style={styles.link}>Já tenho uma conta</Text>
          </TouchableOpacity>
        )}
        {modo === "login" && (
          <TouchableOpacity onPress={() => setModo("cadastro")}>
            <Text style={styles.link}>Criar conta</Text>
          </TouchableOpacity>
        )}
        {modo === "cadastro" && (
          <TouchableOpacity onPress={() => setModo("login")}>
            <Text style={styles.link}>Já tenho uma conta</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  top: {
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 120,
    resizeMode: "contain",
    marginBottom: 30,
  },
  middle: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f90",
    paddingVertical: 14,
    borderRadius: 10,
    width: "80%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#444",
  },
  or: {
    marginHorizontal: 10,
    color: "#888",
  },
  bottom: {
    alignItems: "center",
  },
  link: {
    color: "#f90",
    fontSize: 16,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
  },
  checkboxLabel: {
    color: "#ccc",
    marginLeft: 8,
    fontSize: 14,
  },
});

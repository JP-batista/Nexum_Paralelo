import { useState } from "react"; /* Hook para gerenciamento de Estados do React (professor falou na aula) */
import { useRouter } from "expo-router"; /* Função do Expo Router para navegação entre as telas do projeto (tem na documentação) */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native"; /* importando componentes */
import Input from "../src/components/Input"; /* Campo  de entrada de dados */
import SocialLogin from "../src/components/SocialLogin"; /* Botão*/
import CheckBox from "expo-checkbox"; /* importando o checkbox */

export default function Login() {
  const [modo, setModo] = useState<"inicio" | "login" | "cadastro">(
    "inicio"
  ); /* Utiliza o useState para alterar o estado do modo da tela, semdp que será exibida: inicio, login e cadastro */
  const [termos, setTermos] =
    useState(
      false
    ); /* O estado de termos será alterado por meio di useState, senndo que a variavel temros é um boolean, que iniciará como falso e mudará conforme o usuário, caso ele aceite os termos de uso */
  const router =
    useRouter(); /* Usa o useRouter para navegação entre as telas do app */

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => setModo("inicio")}>
          <Image
            source={require("../src/assets/images/logo.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.middle}>
        {modo === "login" && (
          <>
            <Input placeholder="Email" placeholderTextColor="#aaa" />
            <Input placeholder="Senha" secure placeholderTextColor="#aaa" />
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/perfil")}
            >
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

        {modo === "cadastro" && (
          <>
            <Input placeholder="Nome" placeholderTextColor="#aaa" />
            <Input placeholder="Email" placeholderTextColor="#aaa" />
            <Input placeholder="Senha" secure placeholderTextColor="#aaa" />
            <Input
              placeholder="Confirmar Senha"
              secure
              placeholderTextColor="#aaa"
            />

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

        {modo === "inicio" && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModo("cadastro")}
            >
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

import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { CiCirclePlus } from "react-icons/ci";

const platforms = [
  { name: "Netflix", logo: require("../src/assets/images/netflixlogo.png") },
];

const channels = [
  { id: 1, name: "Canal 1" },
  { id: 2, name: "Canal 2" },
  { id: 3, name: "Canal 3" },
];

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Logo Principal */}
      <View style={styles.logoContainer}>
        <Image source={require("../src/assets/images/logo.png")} style={styles.logo} />
      </View>

      {/* Seção de Plataformas */}
      <View style={styles.top}>
        <Text style={styles.sectionTitle}>Plataformas Disponíveis</Text>
        {platforms.map((platform, index) => (
          <Image key={index} source={platform.logo} style={styles.platformLogo} />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <CiCirclePlus size={24} color="#f90" />
          <Text style={styles.addButtonText}>Adicionar Plataforma</Text>
        </TouchableOpacity>
      </View>

      {/* Canais */}
      <ScrollView contentContainerStyle={styles.middle}>
        {channels.map((channel) => (
          <TouchableOpacity key={channel.id} style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>{channel.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rodapé */}
      <View style={styles.bottom}>
        <View style={styles.divider}>
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
        <Text style={styles.link}>Adicionar novo canal</Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 120,
    resizeMode: "contain",
  },
  top: {
    alignItems: "center",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  platformLogo: {
    width: 150,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#f90",
    fontSize: 16,
    marginLeft: 8,
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
  bottom: {
    alignItems: "center",
  },
  link: {
    color: "#f90",
    fontSize: 16,
    marginTop: 10,
  },
});


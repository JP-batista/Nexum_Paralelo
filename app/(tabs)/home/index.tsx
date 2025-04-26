// Arquivo: nexum/app/(tabs)/home/index.tsx

import { useTmdb } from "../../../contexts/TmdbContext";
import { View, Text, StyleSheet, ScrollView, FlatList, Image, ActivityIndicator } from "react-native";

export default function HomeScreen() {
  const { movies, series, loading } = useTmdb();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f90" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Início</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filmes Populares</Text>
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Séries Populares</Text>
        <FlatList
          horizontal
          data={series}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A1A1D",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    marginRight: 12,
    width: 120,
  },
  cardImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
  },
});

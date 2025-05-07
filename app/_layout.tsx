// Arquivo: nexum/app/_layout.tsx

import { Slot } from "expo-router";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { TmdbProvider } from "../contexts/TmdbContext"; // 👈 Importar o TMDB Provider
import { StatusBar } from "expo-status-bar"; // 👈 Importa o StatusBar

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/splash");
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" }}>
        <ActivityIndicator size="large" color="#f90" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TmdbProvider>
        <StatusBar style="light" backgroundColor="#111111" translucent={false} /> {/* 👈 Aqui! */}
        <RootLayoutNav />
      </TmdbProvider>
    </AuthProvider>
  );
}

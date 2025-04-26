// Arquivo: nexum/app/_layout.tsx

import { Slot, SplashScreen } from "expo-router";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { TmdbProvider } from "../contexts/TmdbContext"; // 👈 Importar o TMDB Provider

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/(auth)/login");
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
      <TmdbProvider> {/* 👈 Agora o TMDB Provider envolve tudo! */}
        <RootLayoutNav />
      </TmdbProvider>
    </AuthProvider>
  );
}

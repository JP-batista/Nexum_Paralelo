// Arquivo: nexum/app/_layout.tsx

import { Slot } from "expo-router";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { TmdbProvider } from "../contexts/TmdbContext"; // 👈 Importar o TMDB Provider
import { StatusBar } from "expo-status-bar"; // 👈 Importa o StatusBar

function RootLayoutNav() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/login");
    }
  }, [user]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TmdbProvider>
        <StatusBar style="light" backgroundColor="#111111" translucent={false} />
        <RootLayoutNav />
      </TmdbProvider>
    </AuthProvider>
  );
}

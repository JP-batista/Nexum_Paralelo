import { Stack } from "expo-router";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Deixa os ícones da status bar claros (modo escuro)
    StatusBar.setBarStyle("light-content");

    // No Android, define a cor de fundo da status bar
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("#1A1A1D");
    }
  }, []);

  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1A1A1D" }}>
      <StatusBar barStyle="light-content" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

    </SafeAreaView>
  );
}

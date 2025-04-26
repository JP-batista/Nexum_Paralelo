// Arquivo: nexum/app/(auth)/_layout.tsx

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade", // se quiser uma transição bonita
        contentStyle: {
          backgroundColor: "#111", // 👈 aqui muda o fundo durante a troca de tela!
        },
      }}
    />
  );
}

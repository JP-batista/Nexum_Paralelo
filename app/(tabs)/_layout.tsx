import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }} edges={["top", "bottom", "left", "right"]}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#f90",
            tabBarInactiveTintColor: "#888",
            tabBarStyle: {
              backgroundColor: "#111111",
              borderTopColor: "#333",
              height: 60,
              paddingBottom: 8,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="(home)/index"
            options={{
              title: "Início",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="(programacao)/index"
            options={{
              title: "Programação",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="(perfil)/index"
            options={{
              title: "Perfil",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-circle-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen name="(home)/detalhesFilme" options={{ href: null }} />
          <Tabs.Screen name="(home)/detalhesSerie" options={{ href: null }} />
          <Tabs.Screen name="(home)/midiasFilme" options={{ href: null }} />
          <Tabs.Screen name="(home)/postersSerie" options={{ href: null }} />
          <Tabs.Screen name="(home)/detalhesElenco" options={{ href: null }} />
          <Tabs.Screen name="(perfil)/avatar" options={{ href: null }} />
          <Tabs.Screen name="(perfil)/editar" options={{ href: null }} />
          <Tabs.Screen name="(perfil)/minhaLista" options={{ href: null }} />
          <Tabs.Screen name="(perfil)/preferencias" options={{ href: null }} />
          <Tabs.Screen name="(programacao)/calendario" options={{ href: null }} />
          <Tabs.Screen name="(programacao)/datas/[data]" options={{ href: null }} />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

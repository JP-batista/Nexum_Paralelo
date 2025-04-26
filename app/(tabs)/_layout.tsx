import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f90",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#1A1A1D",
          borderTopColor: "#333",
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="programacao"
        options={{
          title: "Programação",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil/editar"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

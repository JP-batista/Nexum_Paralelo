// Arquivo: nexum/app/(tabs)/(programacao)/calendario.tsx

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ],
  monthNamesShort: [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ],
  dayNames: [
    "Domingo", "Segunda", "Terça", "Quarta",
    "Quinta", "Sexta", "Sábado"
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
  today: "Hoje",
};

LocaleConfig.defaultLocale = "pt-br";
  
export default function CalendarioScreen() {
  const router = useRouter();
  const hoje = new Date().toISOString().split("T")[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("../(programacao)")}>
          <Ionicons name="arrow-back" size={24} color="#f90" />
        </TouchableOpacity>
        <Text style={styles.title}>Calendário</Text>
      </View>

      <Calendar
        current={hoje}
        onDayPress={(day: DateData) => {
            const [ano, mes, dia] = day.dateString.split("-");
            const dataFormatada = `${dia}${mes}${ano}`;
            router.push({
                pathname: "../(programacao)/datas/[data]",
                params: { data: dataFormatada },
              });
          }}
          
        markedDates={{
          [hoje]: {
            selected: true,
            selectedColor: "#f90",
            textColor: "#111",
          },
        }}
        hideExtraDays={false}
        disableAllTouchEventsForDisabledDays={true}
        theme={{
            backgroundColor: "#111",
            calendarBackground: "#111",
            dayTextColor: "#fff",
            monthTextColor: "#fff",
            arrowColor: "#f90",
            textDisabledColor: "#555", // aqui é onde está a opacidade dos dias do mês anterior/próximo
            textDayFontWeight: "600",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  
});

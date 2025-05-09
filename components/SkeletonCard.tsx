import { View, StyleSheet } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export default function SkeletonCard() {
  return (
    <View style={styles.card}>
        <ShimmerPlaceholder
            style={styles.image}
            shimmerStyle={{ borderRadius: 8 }}
            shimmerColors={["#2a2a2a", "#3a3a3a", "#2a2a2a"]}
            LinearGradient={LinearGradient}
            visible={false}
        />
        <ShimmerPlaceholder
            style={styles.text}
            shimmerColors={["#2a2a2a", "#3a3a3a", "#2a2a2a"]}
            LinearGradient={LinearGradient}
            visible={false}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
    width: 120,
    paddingBottom: 90,
  },

  image: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 6,
  },
  text: {
    width: "80%",
    height: 14,
    borderRadius: 4,
  },
});

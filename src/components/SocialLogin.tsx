import React from "react";
import { View, StyleSheet, Image } from "react-native";

export default function SocialLogin() {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, styles.facebook]}>
        <Image
          source={require("../assets/images/facebook.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <View style={[styles.iconWrapper, styles.google]}>
        <Image
          source={require("../assets/images/google.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <View style={[styles.iconWrapper, styles.twitter]}>
        <Image
          source={require("../assets/images/twitter.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  facebook: {
    backgroundColor: "#1877F2",
  },
  google: {
    backgroundColor: "#fff",
    borderWidth: 1,
  },
  twitter: {
    backgroundColor: "#000",
  },
});

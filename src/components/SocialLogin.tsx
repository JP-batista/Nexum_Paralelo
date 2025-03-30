import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

export default function SocialLogin() {
  function handleLogin(rede: string) {
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.iconWrapper, styles.facebook]}
        onPress={() => handleLogin("Facebook")}
      >
        <Image
          source={require("../assets/images/facebook.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconWrapper, styles.google]}
        onPress={() => handleLogin("Google")}
      >
        <Image
          source={require("../assets/images/google.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconWrapper, styles.twitter]}
        onPress={() => handleLogin("Twitter")}
      >
        <Image
          source={require("../assets/images/twitter.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
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
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  secure?: boolean;
}

export default function Input({ secure = false, ...rest }: InputProps) {
  const [isSecure, setIsSecure] = useState(secure); /* A senha inicia oculta */

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        secureTextEntry={isSecure}
        placeholderTextColor="#999"
        {...rest}
      />

      {secure && (
        <TouchableOpacity
          onPress={() => setIsSecure(!isSecure)}
          style={styles.icon}
        >
          <Ionicons
            name={isSecure ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    marginBottom: 12,
    position: "relative",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
});

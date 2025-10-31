import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform, ViewStyle, TextStyle } from "react-native";

interface ButtonSubmitProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonSubmit;

const styles = StyleSheet.create({
  btn: {
    marginTop: 18,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2E76FF",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#2E76FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  } as ViewStyle,

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  } as TextStyle,
});

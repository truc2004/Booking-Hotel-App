import React from "react";
import { TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";

const ButtonBackScreen = () => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Image
        source={require("../assets/images/icon/back.png")}
        style={styles.backIcon}
      />
    </TouchableOpacity>
  );
};

export default ButtonBackScreen;

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  backIcon: {
    width: 20,
    height: 20,
  },
});

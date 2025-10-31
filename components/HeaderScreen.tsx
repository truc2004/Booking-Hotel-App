import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { useRouter } from "expo-router";

interface HeaderScreenProps {
  title: string;
}

const HeaderScreen: React.FC<HeaderScreenProps> = ({ title }) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      {/* Nút Back bên trái */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image
          source={require("../assets/images/icon/back.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Tiêu đề ở giữa */}
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      {/* View rỗng để giữ cân bằng phải-trái */}
      <View style={{ width: 40 }} />
    </View>
  );
};

export default HeaderScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  backButton: {
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
    resizeMode: "contain",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2E2E",
    marginHorizontal: 10,
  },
});

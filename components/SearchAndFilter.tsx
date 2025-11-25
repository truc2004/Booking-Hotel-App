
import { router } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchAndFilterScreen() {
  const handleSearchPress = () => {
    router.push("/(tabs)/home/search"); // màn search mới
  };

  return (
    <View style={styles.searchWrapper}>
      <TouchableOpacity
        style={styles.inputSearch}
        activeOpacity={0.9}
        onPress={handleSearchPress}
      >
        <Image
          source={require("../assets/images/icon/search.png")}
          style={styles.iconSearch}
        />
        <Text style={styles.searchPlaceholder}>Tìm kiếm địa điểm...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
  },
  inputSearch: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    width: "100%",         
  },
  iconSearch: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: "contain",
  },
  searchPlaceholder: {
    color: "#9B9B9B",
    fontSize: 14,
  },
});

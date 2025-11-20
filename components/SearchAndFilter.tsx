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
  const handleFilter = () => {
    router.push("/(tabs)/home/filter");
  };

  const handleSearchPress = () => {
    router.push("/(tabs)/home/search"); // màn search mới
  };

  return (
    <View style={styles.searchContainer}>
      {/* Ô search bấm là nhảy qua màn search */}
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

      <TouchableOpacity style={styles.filter} onPress={handleFilter}>
        <Image
          source={require("../assets/images/icon/fitler.png")}
          style={styles.iconFilter}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 16,
  },
  inputSearch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
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
  filter: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2E76FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  iconFilter: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
    resizeMode: "contain",
  },
});

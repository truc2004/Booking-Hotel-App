import ButtonBackScreen from "@/components/ButtonBackScreen";
import HeaderScreen from "@/components/HeaderScreen";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
   
  ]);

  const handleSearch = (keyword?: string) => {
    const q = (keyword ?? query).trim();
    if (!q) return;

    setRecentSearches((prev) => {
      const list = [q, ...prev.filter((item) => item !== q)];
      return list.slice(0, 5);
    });

    router.push({
      pathname: "/(tabs)/home/listRoom",
      params: { q },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <ButtonBackScreen />
        
      </View>
    

      {/* Ô search */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch()}
        />
        {/* <TouchableOpacity onPress={() => handleSearch()}>
          <Text style={styles.btnText}>Tìm</Text>
        </TouchableOpacity> */}
      </View>

      {/* Recent Search */}
      <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.recentRow}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => handleSearch(item)}
            >
              <Text style={styles.recentText}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setRecentSearches((prev) => prev.filter((r) => r !== item))
              }
            >
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  title: { fontSize: 18, fontWeight: "600" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
  },
  input: { flex: 1, height: 44 },
  btnText: { color: "#2E76FF", fontWeight: "600", marginLeft: 8 },
  sectionTitle: { marginTop: 20, fontSize: 16, fontWeight: "600" },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
  },
  recentText: { fontSize: 14 },
  remove: { fontSize: 16, color: "#999", paddingHorizontal: 8 },
});

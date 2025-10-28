import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingCard from "../../../components/BookingCard";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  gray: "#CFCFCF",
  grayWhite: "#EFEFEF",
};

const DATA = {
  upcoming: [
    { id: 1, name: "GoldenValley", location: "New York, USA", price: 150, rating: 4.9, image: "https://picsum.photos/400/240?1" },
    { id: 2, name: "AlohaVista", location: "New York, USA", price: 450, rating: 4.8, image: "https://picsum.photos/400/240?2" },
  ],
  completed: [
    { id: 3, name: "HarborHaven Hideaway", location: "New York, USA", price: 700, rating: 4.8, image: "https://picsum.photos/400/240?3" },
  ],
  cancelled: [
    { id: 5, name: "GreenView", location: "Paris, France", price: 320, rating: 4.6, image: "https://picsum.photos/400/240?5" },
  ],
};

export default function MyBookingsScreen() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color={COLOR.black} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>My Bookings</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.tabRow}>
        {["upcoming", "completed", "cancelled"].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t as any)} style={styles.tabBtn}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t[0].toUpperCase() + t.slice(1)}
            </Text>
            {tab === t && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={DATA[tab]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BookingCard item={item} type={tab} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8, height: 44 },
  topTitle: { fontSize: 16, fontWeight: "600", color: "#101010" },
  tabRow: { flexDirection: "row", justifyContent: "space-around", borderBottomWidth: 1, borderColor: "#EFEFEF" },
  tabBtn: { alignItems: "center", paddingVertical: 8 },
  tabText: { color: "#CFCFCF", fontWeight: "500" },
  tabTextActive: { color: "#2E76FF" },
  tabUnderline: { height: 2, width: 40, backgroundColor: "#2E76FF", marginTop: 4, borderRadius: 1 },
});

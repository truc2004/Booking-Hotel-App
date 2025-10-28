import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingCard from "../../components/BookingCard";
import ButtonBackScreen from "@/components/ButtonBackScreen";

const COLOR = { blue: "#2E76FF", black: "#101010", gray: "#CFCFCF", grayWhite: "#EFEFEF" };

// Mapping key tiếng Anh -> nhãn hiển thị tiếng Việt
const TAB_LABELS: Record<string, string> = {
  upcoming: "Đang đặt",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

// Dữ liệu sample
const DATA = {
  upcoming: [
    { id: 1, name: "GoldenValley", location: "123 Nguyễn Kiệm, Gò Vấp", price: 150, rating: 4.9, image: "../../assets/images/hotel1/1.jpg" },
  ],
  completed: [
    { id: 3, name: "HarborHaven Hideaway", location: "123 Nguyễn Kiệm, Gò Vấp", price: 700, rating: 4.8, image: "../../assets/images/hotel3/1.jpg" },
  ],
  cancelled: [
    { id: 5, name: "GreenView", location: "123 Nguyễn Kiệm, Gò Vấp", price: 320, rating: 4.6, image: "../../assets/images/hotel1/1.jpg" },
  ],
};

export default function MyBookingsScreen() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  return (
    <SafeAreaView style={styles.container}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <ButtonBackScreen />
        <Text style={styles.topTitle}>Lịch sử đặt phòng</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {Object.entries(TAB_LABELS).map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setTab(key as any)} style={styles.tabBtn}>
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
            {tab === key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Booking list */}
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
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 44 },
  topTitle: { fontSize: 16, fontWeight: "600", color: "#101010" },
  tabRow: { flexDirection: "row", justifyContent: "space-around", borderBottomWidth: 1, borderColor: "#EFEFEF", marginTop: 20 },
  tabBtn: { alignItems: "center", paddingVertical: 8 },
  tabText: { color: "#CFCFCF", fontWeight: "500" },
  tabTextActive: { color: "#2E76FF" },
  tabUnderline: { height: 2, width: 40, backgroundColor: "#2E76FF", marginTop: 4, borderRadius: 1 },
});

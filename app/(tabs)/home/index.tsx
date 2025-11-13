import SearchAndFilterScreen from "@/components/SearchAndFilter";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchRooms } from "../../../api/roomApi";
import RoomCard from "../../../components/RoomCard";
import RoomCardVertical from "../../../components/RoomCardVertical";
import { Room } from "../../../types/room";
export default function HomeScreen() {

  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const hotRooms = useMemo(() => rooms?.slice(0, 5) ?? [], [rooms]);
  const standardRooms = useMemo(() => rooms?.slice(5, 15) ?? [], [rooms]);

  const handleViewListRoom = () => {
    router.push("/(tabs)/home/listRoom");
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2E76FF" />
      </View>
    );
  if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;

  // Dùng FlatList cha cho toàn màn
  return (
    
    <SafeAreaView style={styles.container} edges={["top"]}>

      <FlatList
        data={standardRooms}
        keyExtractor={(item) => item.room_id}
        renderItem={({ item }) => <RoomCard room={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 20 }}
        ListHeaderComponent={
          <View>
            {/* Thanh tìm kiếm */}
            <SearchAndFilterScreen />

            {/* Phòng nổi bật (FlatList ngang) */}
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Phòng nổi bật</Text>
                <TouchableOpacity onPress={handleViewListRoom}>
                  <Text style={styles.textBlue}>Tất cả</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={hotRooms}
                renderItem={({ item }) => <RoomCardVertical room={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.room_id}
                contentContainerStyle={{ paddingHorizontal: 6 }}
              />
            </View>

            {/* Tiêu đề danh sách phòng */}
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Phòng gần bạn</Text>
                <TouchableOpacity onPress={handleViewListRoom}>
                  <Text style={styles.textBlue}>Tất cả</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  error: { color: "red", textAlign: "center", marginTop: 40 },
  section: { marginBottom: 28 },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 6,
  },
  textBlue: { color: "#2E76FF" },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
});

// app/(tabs)/profile/favorite.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderScreen from "@/components/HeaderScreen";
import { useFavoriteRooms } from "@/hooks/useFavoriteRooms"; 
import { fetchRoomById } from "@/api/roomApi";
import { Room } from "@/types/room";
import RoomCard from "@/components/RoomCard";
import RoomCardVertical from "@/components/RoomCardVertical";

export default function FavoriteScreen() {
  const { favoriteRoomIds } = useFavoriteRooms();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      // Không có phòng yêu thích -> clear list
      if (!favoriteRoomIds.length) {
        setRooms([]);
        return;
      }

      setLoading(true);
      try {
        const data = await Promise.all(
          favoriteRoomIds.map(async (id) => {
            try {
              const room = await fetchRoomById(id);
              return room as Room;
            } catch (err) {
              console.error("Lỗi tải phòng yêu thích:", id, err);
              return null;
            }
          })
        );

        const validRooms = data.filter(
          (r): r is Room => r !== null
        );
        setRooms(validRooms);
      } catch (err) {
        console.error("Lỗi tải danh sách yêu thích:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [favoriteRoomIds]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HeaderScreen title="Khách sạn yêu thích" />

      {loading && (
        <ActivityIndicator style={{ marginTop: 20 }} />
      )}

      {!loading && !favoriteRoomIds.length && (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            Bạn chưa có khách sạn nào trong danh sách yêu thích.
          </Text>
          <Text style={styles.emptySub}>
            Hãy chạm vào biểu tượng trái tim ở thẻ phòng để thêm vào danh sách.
          </Text>
        </View>
      )}

      {!loading && favoriteRoomIds.length > 0 && (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.room_id}
          renderItem={({ item }) => <RoomCard room={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  listContent: {
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 16,
  },
  emptyWrap: {
    marginTop: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  emptySub: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
});

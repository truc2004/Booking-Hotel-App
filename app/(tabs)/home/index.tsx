import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomCard from "../../../components/RoomCard";
import RoomCardVertical from "../../../components/RoomCardVertical";
import { fetchRooms } from "../../../api/roomApi";
import { Room } from "../../../types/room";
import { router } from "expo-router";
import SearchAndFilterScreen from "@/components/SearchAndFilter";
import { Review } from "@/types/review";


export default function HomeScreen() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 

  useEffect(() => {
    const loadDataRoom = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDataRoom();
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2E76FF" />
      </View>
    );

  if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;

  const hotRooms = rooms ? rooms.slice(0, 5) : [];
  const standardRooms = rooms ? rooms.slice(5, 20) : [];

  const handleViewListRoom = () => {
    router.push("/home/listRoom");
  };

  return (
    <SafeAreaView style={[styles.container]}>

      {/* Dùng 1 FlatList duy nhất */}
      <FlatList
        data={standardRooms}
        keyExtractor={(item) => item.room_id}
        renderItem={({ item }) => <RoomCard room={item} />}
        contentContainerStyle={{ paddingHorizontal: 6 }}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <>
            {/* Thanh tìm kiếm */}
            <SearchAndFilterScreen />

            {/* Phòng nổi bật */}
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Phòng nổi bật</Text>
                <TouchableOpacity onPress={handleViewListRoom}>
                  <Text style={styles.textBule}>Tất cả</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={hotRooms}
                renderItem={({ item }) => (
                  <RoomCardVertical room={item} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.room_id}
                contentContainerStyle={{ paddingHorizontal: 6 }}
              />
            </View>

            {/* Phòng gần bạn */}
            <View style={styles.titleContainer}>
              <Text style={styles.sectionTitle}>Phòng gần bạn</Text>
              <TouchableOpacity onPress={handleViewListRoom}>
                <Text style={styles.textBule}>Tất cả</Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    paddingHorizontal: 15,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
  },
  section: {
    marginBottom: 28,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  textBule: {
    color: "#2E76FF",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});
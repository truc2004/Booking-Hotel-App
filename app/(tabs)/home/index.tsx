import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomCard from "../../../components/RoomCard";
import RoomCardVertical from "../../../components/RoomCardVertical";
import { fetchRooms } from "../../../api/roomApi";
import { Room } from "../../../types/room";
import { router } from "expo-router";
import SearchAndFilterScreen from "@/components/SearchAndFilter";

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

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E76FF" />
      </View>
    );
  if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;

  const hotRooms = rooms ? rooms.slice(0, 5) : [];
  const standardRooms = rooms ? rooms.slice(5, 15) : [];

  const handleViewListRoom = () => {
    router.push("/home/listRoom");
  }


  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            renderItem={({ item }) => <RoomCardVertical room={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.room_id}
            contentContainerStyle={{ paddingHorizontal: 6 }}
          />

        </View>

        {/* Danh sách phòng */}
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Phòng gần bạn</Text>
            <TouchableOpacity onPress={handleViewListRoom}>
              <Text style={styles.textBule}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={standardRooms}
            keyExtractor={(item) => item.room_id}
            renderItem={({ item }) => <RoomCardVertical room={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 6 }}
          />
        </View>
      </ScrollView>
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

  // --- Sections ---
  section: {
    marginBottom: 28,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    height: 50,

  },
  textBule: {
    color: '#2E76FF'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomCard from "../../../components/RoomCard";
import RoomCardVertical from "../../../components/RoomCardVertical";
import { fetchRooms } from "../../../api/roomApi";
import { Room } from "../../../types/room";
import { router } from "expo-router";

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

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2E76FF" />;
  if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;

  const hotRooms = rooms ? rooms.slice(0, 5) : [];
  const standardRooms = rooms ? rooms.slice(5, 15) : [];

  const handleFilter = () => {
    router.push("/home/filter");
  };

  const handleViewListRoom = () => {
    router.push("/home/listRoom");
  }


  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Thanh tìm kiếm */}
        <View style={styles.searchContainer}>
          <View style={styles.inputSearch}>
            <Image
              source={require("../../../assets/images/icon/search.png")}
              style={styles.iconSearch}
            />
            <TextInput
              placeholder="Tìm kiếm địa điểm..."
              placeholderTextColor="#777"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity style={styles.filter} onPress={handleFilter}>
            <Image
              source={require("../../../assets/images/icon/fitler.png")}
              style={styles.iconFilter}
            />
          </TouchableOpacity>
        </View>

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
            contentContainerStyle={{ paddingRight: 20}}
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
            renderItem={({ item }) => <RoomCard room={item} />}
            scrollEnabled={false}

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
    paddingHorizontal: 18,

  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
  },

  // --- Search bar ---
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    marginLeft: 5,
  },
  inputSearch: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F3F6",
    paddingHorizontal: 12,
    borderRadius: 14,
    flex: 1,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  iconSearch: {
    width: 22,
    height: 22,
    tintColor: "#2E76FF",
    marginRight: 8,
  },
  filter: {
    backgroundColor: "#2E76FF",
    borderRadius: 14,
    marginLeft: 12,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E76FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  iconFilter: {
    width: 22,
    height: 22,
    tintColor: "#fff",
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

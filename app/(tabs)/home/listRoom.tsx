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
import { fetchRooms } from "../../../api/roomApi";
import { Room } from "../../../types/room";
import SearchAndFilterScreen from "@/components/SearchAndFilter";
import { LinearGradient } from "expo-linear-gradient";
import ButtonBackScreen from "@/components/ButtonBackScreen";

const PAGE_SIZE = 8;

export default function ListRoomScreen() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = rooms ? Math.ceil(rooms.length / PAGE_SIZE) : 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentRooms = rooms ? rooms.slice(startIndex, endIndex) : [];

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleGoPage = (page: number) => setCurrentPage(page);

  // Lọc ra 3 số trang tối đa
  const getVisiblePages = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };
  const visiblePages = getVisiblePages();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header cố định */}
      <View style={styles.header}>
        <ButtonBackScreen />
        <Text style={styles.headerText}>Danh sách phòng</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchAndFilterScreen />

        <FlatList
          data={currentRooms}
          keyExtractor={(item) => item.room_id}
          renderItem={({ item }) => <RoomCard room={item} />}
          scrollEnabled={false}
        />

        {/* Phân trang hiện đại */}
        <View style={styles.paginationContainer}>
          <LinearGradient
            colors={["#4D90FE", "#2E76FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
          >
            <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1}>
              <Text style={styles.navText}>‹</Text>
            </TouchableOpacity>
          </LinearGradient>

          {visiblePages.map((page) => (
            <TouchableOpacity
              key={page}
              style={[styles.pageButton, page === currentPage && styles.activePageButton]}
              onPress={() => handleGoPage(page)}
            >
              <Text style={[styles.pageText, page === currentPage && styles.activePageText]}>
                {page}
              </Text>
            </TouchableOpacity>
          ))}

          <LinearGradient
            colors={["#4D90FE", "#2E76FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.navButton, currentPage === totalPages && styles.disabledButton]}
          >
            <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages}>
              <Text style={styles.navText}>›</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF", paddingHorizontal: 18 },
  error: { color: "red", textAlign: "center", marginTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginBottom: 10,
  },
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  navButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#2E76FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: { opacity: 0.4 },
  navText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6E6E6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activePageButton: {
    backgroundColor: "#2E76FF",
    shadowColor: "#2E76FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  pageText: { color: "#555", fontWeight: "600", fontSize: 14 },
  activePageText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});

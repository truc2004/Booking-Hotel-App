import HeaderScreen from "@/components/HeaderScreen";
import SearchAndFilterScreen from "@/components/SearchAndFilter";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchRooms } from "@/api/roomApi";
import RoomCard from "@/components/RoomCard";
import { Room } from "@/types/room";

const PAGE_SIZE = 8;

export default function ListRoomScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (err: any) {
        setError(err.message ?? "Lỗi tải phòng");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // mỗi lần từ khóa search thay đổi → quay về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  const keyword = useMemo(
    () => (typeof q === "string" ? q.trim().toLowerCase() : ""),
    [q]
  );

  const filteredRooms = useMemo(() => {
    if (!keyword) return rooms;

    return rooms.filter((room) => {
      const searchable = JSON.stringify(room ?? {}).toLowerCase();
      return searchable.includes(keyword);
    });
  }, [rooms, keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentRooms = filteredRooms.slice(startIndex, startIndex + PAGE_SIZE);

  const handleGoPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // ====== CHỈ HIỂN THỊ TỐI ĐA 3 SỐ TRANG ======
  const visiblePages = 3;
  const pageNumbers = useMemo(() => {
    if (totalPages <= visiblePages) {
      // nếu tổng số trang <= 3 thì cho hiện hết
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = currentPage - 1;
    let end = currentPage + 1;

    // chạm đầu
    if (start < 1) {
      start = 1;
      end = visiblePages;
    }
    // chạm cuối
    else if (end > totalPages) {
      end = totalPages;
      start = totalPages - visiblePages + 1;
    }

    const arr: number[] = [];
    for (let p = start; p <= end; p++) {
      arr.push(p);
    }
    return arr;
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2E76FF" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HeaderScreen title="Danh sách phòng" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SEARCH */}
        <SearchAndFilterScreen />

        {/* LIST ROOM */}
        {currentRooms.length === 0 ? (
          <Text style={styles.noResult}>Không tìm thấy phòng phù hợp</Text>
        ) : (
          <FlatList
            data={currentRooms}
            keyExtractor={(item) => item.room_id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <RoomCard room={item} />}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* PHÂN TRANG – chỉ render khi có hơn 1 trang */}
        {filteredRooms.length > PAGE_SIZE && totalPages > 1 && (
          <View style={styles.paginationWrapper}>
            <View style={styles.paginationContainer}>
              {/* Prev */}
              <TouchableOpacity
                disabled={currentPage === 1}
                onPress={handlePrev}
                activeOpacity={currentPage === 1 ? 1 : 0.8}
                style={[
                  styles.navButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
              >
                <LinearGradient
                  colors={["#4D90FE", "#2E76FF"]}
                  style={styles.navButtonGradient}
                >
                  <Text style={styles.navText}>‹</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* TỐI ĐA 3 SỐ TRANG */}
              {pageNumbers.map((page) => {
                const isActive = page === currentPage;
                return (
                  <TouchableOpacity
                    key={page}
                    onPress={() => handleGoPage(page)}
                    activeOpacity={0.8}
                    style={[
                      styles.pageButton,
                      isActive && styles.activePageButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pageText,
                        isActive && styles.activePageText,
                      ]}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Next */}
              <TouchableOpacity
                disabled={currentPage === totalPages}
                onPress={handleNext}
                activeOpacity={currentPage === totalPages ? 1 : 0.8}
                style={[
                  styles.navButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
              >
                <LinearGradient
                  colors={["#4D90FE", "#2E76FF"]}
                  style={styles.navButtonGradient}
                >
                  <Text style={styles.navText}>›</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============== STYLES ============== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  scrollContent: {
    paddingHorizontal: 19,
    paddingTop: 8,
    paddingBottom: 24,
  },

  listContent: {
    paddingBottom: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noResult: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },

  paginationWrapper: {
    marginTop: 16,
    alignItems: "center",
  },

  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
  },

  navButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    overflow: "hidden",
    marginHorizontal: 4,
  },

  navButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.35,
  },

  navText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#2E76FF",
    backgroundColor: "#FFFFFF",
  },

  pageText: {
    fontSize: 14,
    color: "#2E76FF",
    fontWeight: "500",
  },

  activePageButton: {
    backgroundColor: "#2E76FF",
  },

  activePageText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
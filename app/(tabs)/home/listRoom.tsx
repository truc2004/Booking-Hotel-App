// app/(tabs)/home/listRoom.tsx

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

const PAGE_SIZE = 6;

export default function ListRoomScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // gọi API chung với home
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

  // reset về trang 1 mỗi khi từ khóa search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  // keyword từ query
  const keyword = useMemo(
    () => (typeof q === "string" ? q.trim().toLowerCase() : ""),
    [q]
  );

  // lọc theo keyword trên toàn bộ dữ liệu phòng
  const filteredRooms = useMemo(() => {
    if (!keyword) return rooms;

    return rooms.filter((room) => {
      // nếu muốn chắc ăn, quét toàn bộ object bằng JSON.stringify
      const searchable = JSON.stringify(room ?? {}).toLowerCase();
      return searchable.includes(keyword);
    });
  }, [rooms, keyword]);

  // phân trang
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
      {/* HEADER */}
      <HeaderScreen title="Danh sách phòng" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
      >
        {/* SEARCH + FILTER: chỉ hiện 1 lần */}
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
          />
        )}

        {/* PAGINATION */}
        <View style={styles.paginationContainer}>
          {/* Prev */}
          <LinearGradient
            colors={["#4D90FE", "#2E76FF"]}
            style={[
              styles.navButton,
              currentPage === 1 && styles.disabledButton,
            ]}
          >
            <TouchableOpacity disabled={currentPage === 1} onPress={handlePrev}>
              <Text style={styles.navText}>‹</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Page numbers */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;
            return (
              <TouchableOpacity
                key={page}
                onPress={() => handleGoPage(page)}
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
          <LinearGradient
            colors={["#4D90FE", "#2E76FF"]}
            style={[
              styles.navButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
          >
            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={handleNext}
            >
              <Text style={styles.navText}>›</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============== STYLES ============== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

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

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  navButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.4,
  },

  navText: {
    fontSize: 22,
    color: "#FFFFFF",
  },

  pageButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#2E76FF",
  },

  pageText: {
    fontSize: 14,
    color: "#2E76FF",
  },

  activePageButton: {
    backgroundColor: "#2E76FF",
  },

  activePageText: {
    color: "#FFFFFF",
  },
});

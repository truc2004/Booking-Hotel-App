// import HeaderScreen from "@/components/HeaderScreen";
// import SearchAndFilterScreen from "@/components/SearchAndFilter";
// import { LinearGradient } from "expo-linear-gradient";
// import { useLocalSearchParams } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { fetchRooms } from "@/api/roomApi";
// import RoomCard from "@/components/RoomCard";
// import { Room } from "@/types/room";

// const PAGE_SIZE = 8;

// export default function ListRoomScreen() {
//   const { q } = useLocalSearchParams<{ q?: string }>();

//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await fetchRooms();
//         setRooms(data);
//       } catch (err: any) {
//         setError(err.message ?? "Lỗi tải phòng");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // mỗi lần từ khóa search thay đổi → quay về trang 1
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [q]);

//   const keyword = useMemo(
//     () => (typeof q === "string" ? q.trim().toLowerCase() : ""),
//     [q]
//   );

//   const filteredRooms = useMemo(() => {
//     if (!keyword) return rooms;

//     return rooms.filter((room) => {
//       const searchable = JSON.stringify(room ?? {}).toLowerCase();
//       return searchable.includes(keyword);
//     });
//   }, [rooms, keyword]);

//   const totalPages = Math.max(1, Math.ceil(filteredRooms.length / PAGE_SIZE));
//   const startIndex = (currentPage - 1) * PAGE_SIZE;
//   const currentRooms = filteredRooms.slice(startIndex, startIndex + PAGE_SIZE);

//   const handleGoPage = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   // ====== CHỈ HIỂN THỊ TỐI ĐA 3 SỐ TRANG ======
//   const visiblePages = 3;
//   const pageNumbers = useMemo(() => {
//     if (totalPages <= visiblePages) {
//       // nếu tổng số trang <= 3 thì cho hiện hết
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }

//     let start = currentPage - 1;
//     let end = currentPage + 1;

//     // chạm đầu
//     if (start < 1) {
//       start = 1;
//       end = visiblePages;
//     }
//     // chạm cuối
//     else if (end > totalPages) {
//       end = totalPages;
//       start = totalPages - visiblePages + 1;
//     }

//     const arr: number[] = [];
//     for (let p = start; p <= end; p++) {
//       arr.push(p);
//     }
//     return arr;
//   }, [currentPage, totalPages]);

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <ActivityIndicator size="large" color="#2E76FF" />
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <Text style={{ color: "red" }}>{error}</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       <HeaderScreen title="Danh sách phòng" />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* SEARCH */}
//         <SearchAndFilterScreen />

//         {/* LIST ROOM */}
//         {currentRooms.length === 0 ? (
//           <Text style={styles.noResult}>Không tìm thấy phòng phù hợp</Text>
//         ) : (
//           <FlatList
//             data={currentRooms}
//             keyExtractor={(item) => item.room_id}
//             scrollEnabled={false}
//             showsVerticalScrollIndicator={false}
//             renderItem={({ item }) => <RoomCard room={item} />}
//             contentContainerStyle={styles.listContent}
//           />
//         )}

//         {/* PHÂN TRANG – chỉ render khi có hơn 1 trang */}
//         {filteredRooms.length > PAGE_SIZE && totalPages > 1 && (
//           <View style={styles.paginationWrapper}>
//             <View style={styles.paginationContainer}>
//               {/* Prev */}
//               <TouchableOpacity
//                 disabled={currentPage === 1}
//                 onPress={handlePrev}
//                 activeOpacity={currentPage === 1 ? 1 : 0.8}
//                 style={[
//                   styles.navButton,
//                   currentPage === 1 && styles.disabledButton,
//                 ]}
//               >
//                 <LinearGradient
//                   colors={["#4D90FE", "#2E76FF"]}
//                   style={styles.navButtonGradient}
//                 >
//                   <Text style={styles.navText}>‹</Text>
//                 </LinearGradient>
//               </TouchableOpacity>

//               {/* TỐI ĐA 3 SỐ TRANG */}
//               {pageNumbers.map((page) => {
//                 const isActive = page === currentPage;
//                 return (
//                   <TouchableOpacity
//                     key={page}
//                     onPress={() => handleGoPage(page)}
//                     activeOpacity={0.8}
//                     style={[
//                       styles.pageButton,
//                       isActive && styles.activePageButton,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.pageText,
//                         isActive && styles.activePageText,
//                       ]}
//                     >
//                       {page}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}

//               {/* Next */}
//               <TouchableOpacity
//                 disabled={currentPage === totalPages}
//                 onPress={handleNext}
//                 activeOpacity={currentPage === totalPages ? 1 : 0.8}
//                 style={[
//                   styles.navButton,
//                   currentPage === totalPages && styles.disabledButton,
//                 ]}
//               >
//                 <LinearGradient
//                   colors={["#4D90FE", "#2E76FF"]}
//                   style={styles.navButtonGradient}
//                 >
//                   <Text style={styles.navText}>›</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* ============== STYLES ============== */

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF" },

//   scrollContent: {
//     paddingHorizontal: 19,
//     paddingTop: 8,
//     paddingBottom: 24,
//   },

//   listContent: {
//     paddingBottom: 8,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   noResult: {
//     textAlign: "center",
//     marginTop: 20,
//     fontSize: 16,
//     color: "#777",
//   },

//   paginationWrapper: {
//     marginTop: 16,
//     alignItems: "center",
//   },

//   paginationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 999,
//     backgroundColor: "#F1F5F9",
//   },

//   navButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 999,
//     overflow: "hidden",
//     marginHorizontal: 4,
//   },

//   navButtonGradient: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   disabledButton: {
//     opacity: 0.35,
//   },

//   navText: {
//     fontSize: 20,
//     color: "#FFFFFF",
//     fontWeight: "600",
//   },

//   pageButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 4,
//     borderWidth: 1,
//     borderColor: "#2E76FF",
//     backgroundColor: "#FFFFFF",
//   },

//   pageText: {
//     fontSize: 14,
//     color: "#2E76FF",
//     fontWeight: "500",
//   },

//   activePageButton: {
//     backgroundColor: "#2E76FF",
//   },

//   activePageText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//   },
// });

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
import { fetchHotels } from "@/api/hotelApi";
import RoomCard from "@/components/RoomCard";
import { Room } from "@/types/room";
import { Hotel } from "@/types/hotel";

const PAGE_SIZE = 8;

type Params = {
  q?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  facilities?: string; // "All,Chỗ đỗ xe,Phòng gym"
  bedrooms?: string;   // "1,2,3"
};

export default function ListRoomScreen() {
  const {
    q,
    sort,
    minPrice,
    maxPrice,
    rating,
    facilities,
    bedrooms,
  } = useLocalSearchParams<Params>();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Load rooms + hotels
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [roomData, hotelData] = await Promise.all([
          fetchRooms(),
          fetchHotels(),
        ]);

        setRooms(roomData);
        setHotels(hotelData);
      } catch (err: any) {
        setError(err?.message ?? "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 2. Map hotel_id -> hotel để tra nhanh
  const hotelMap = useMemo(() => {
    const map: Record<string, Hotel> = {};
    hotels.forEach((h) => {
      if (h.hotel_id) map[h.hotel_id] = h;
    });
    return map;
  }, [hotels]);

  // 3. Chuẩn hoá các param từ URL
  const keyword = useMemo(
    () => (typeof q === "string" ? q.trim().toLowerCase() : ""),
    [q]
  );

  const sortKey = useMemo(
    () => (typeof sort === "string" ? sort : "all"),
    [sort]
  );

  const minPriceNum = useMemo(() => {
    if (!minPrice) return undefined;
    const n = Number(minPrice);
    return Number.isNaN(n) ? undefined : n;
  }, [minPrice]);

  const maxPriceNum = useMemo(() => {
    if (!maxPrice) return undefined;
    const n = Number(maxPrice);
    return Number.isNaN(n) ? undefined : n;
  }, [maxPrice]);

  const ratingRange = useMemo(() => {
    if (typeof rating !== "string" || !rating.includes("-")) return null;
    const [minStr, maxStr] = rating.split("-").map((s) => s.trim());
    const minR = Number(minStr);
    const maxR = Number(maxStr);
    return {
      min: Number.isNaN(minR) ? undefined : minR,
      max: Number.isNaN(maxR) ? undefined : maxR,
    };
  }, [rating]);

  const facilitiesList = useMemo(() => {
    if (typeof facilities !== "string" || !facilities) return [];
    return facilities
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s.toLowerCase() !== "all");
  }, [facilities]);

  const bedroomsList = useMemo(() => {
    if (typeof bedrooms !== "string" || !bedrooms) return [];
    return bedrooms
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const n = Number(s.replace(/\D/g, ""));
        return Number.isNaN(n) ? undefined : n;
      })
      .filter((n): n is number => n !== undefined);
  }, [bedrooms]);

  // 4. Khi đổi bất kỳ param nào → quay về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [q, sort, minPrice, maxPrice, rating, facilities, bedrooms]);

  // 5. Áp dụng SEARCH + FILTER + SORT
  const filteredRooms = useMemo(() => {
    if (!rooms.length) return [];

    let result = rooms.filter((room) => {
      const hotel = hotelMap[room.hotel_id];

      // ----- SEARCH: gần đúng, chỉ cần "chứa" keyword -----
      let matchesKeyword = true;
      if (keyword) {
        const pieces: string[] = [];

        // thông tin phòng
        pieces.push(room.description ?? "");
        pieces.push(room.amenities ?? "");
        pieces.push(String(room.rate ?? ""));
        pieces.push(String(room.bed_count ?? ""));

        // thông tin khách sạn
        if (hotel) {
          pieces.push(hotel.name ?? "");
          if (hotel.addresses) {
            pieces.push(hotel.addresses.detailAddress ?? "");
            pieces.push(hotel.addresses.district ?? "");
            pieces.push(hotel.addresses.province ?? "");
          }
        }

        const combined = pieces.join(" ").toLowerCase();
        matchesKeyword = combined.includes(keyword);
      }

      // ----- FILTER: price -----
      const price = room.price_per_night ?? 0;
      let matchesPrice = true;
      if (minPriceNum !== undefined && price < minPriceNum) {
        matchesPrice = false;
      }
      if (maxPriceNum !== undefined && price > maxPriceNum) {
        matchesPrice = false;
      }

      // ----- FILTER: rating -----
      let matchesRating = true;
      const roomRating = room.rate ?? 0;
      if (ratingRange?.min !== undefined && roomRating < ratingRange.min) {
        matchesRating = false;
      }
      if (ratingRange?.max !== undefined && roomRating > ratingRange.max) {
        matchesRating = false;
      }

      // ----- FILTER: facilities (tiện nghi) -----
      let matchesFacilities = true;
      if (facilitiesList.length > 0) {
        const amenities = (room.amenities ?? "").toLowerCase();
        matchesFacilities = facilitiesList.every((f) =>
          amenities.includes(f.toLowerCase())
        );
      }

      // ----- FILTER: bedrooms (số phòng ngủ) -----
      let matchesBedrooms = true;
      if (bedroomsList.length > 0) {
        matchesBedrooms = bedroomsList.includes(room.bed_count);
      }

      return (
        matchesKeyword &&
        matchesPrice &&
        matchesRating &&
        matchesFacilities &&
        matchesBedrooms
      );
    });

    // ----- SORT -----
    result = [...result]; // clone để không mutate state gốc
    switch (sortKey) {
      case "price_low":
        result.sort(
          (a, b) => (a.price_per_night ?? 0) - (b.price_per_night ?? 0)
        );
        break;
      case "price_high":
        result.sort(
          (a, b) => (b.price_per_night ?? 0) - (a.price_per_night ?? 0)
        );
        break;
      case "popular":
        result.sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0));
        break;
      // "nearby" và "all": giữ nguyên thứ tự
      default:
        break;
    }

    return result;
  }, [
    rooms,
    hotelMap,
    keyword,
    sortKey,
    minPriceNum,
    maxPriceNum,
    ratingRange,
    facilitiesList,
    bedroomsList,
  ]);

  // 6. Nếu lọc/tìm ra 0 kết quả → fallback lại toàn bộ rooms
  const usedRooms = filteredRooms.length > 0 ? filteredRooms : rooms;

  const totalPages = Math.max(1, Math.ceil(usedRooms.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentRooms = usedRooms.slice(startIndex, startIndex + PAGE_SIZE);

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

  const visiblePages = 3;
  const pageNumbers = useMemo(() => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = currentPage - 1;
    let end = currentPage + 1;

    if (start < 1) {
      start = 1;
      end = visiblePages;
    } else if (end > totalPages) {
      end = totalPages;
      start = totalPages - visiblePages + 1;
    }

    const arr: number[] = [];
    for (let p = start; p <= end; p++) arr.push(p);
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

  // Nếu API không có bất kì phòng nào
  if (rooms.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Hiện chưa có phòng nào.</Text>
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
        {/* Ô search/filter nhỏ ở trên (giữ nguyên nếu bạn đang dùng) */}
        <SearchAndFilterScreen />

        {/* LIST ROOM – luôn hiển thị (vì nếu lọc = 0 thì đã fallback usedRooms = rooms) */}
        <FlatList
          data={currentRooms}
          keyExtractor={(item) => item.room_id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <RoomCard room={item} />}
          contentContainerStyle={styles.listContent}
        />

        {/* PHÂN TRANG – chỉ render khi có hơn 1 trang */}
        {usedRooms.length > PAGE_SIZE && totalPages > 1 && (
          <View style={styles.paginationWrapper}>
            <View className="paginationContainer" style={styles.paginationContainer}>
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

              {/* Các số trang (tối đa 3) */}
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

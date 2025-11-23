// import { useEffect, useState } from "react";
// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,            // 👈 THÊM IMPORT NÀY
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import RoomCardVertical from "../../../components/RoomCardVertical";
// import { fetchRooms } from "../../../api/roomApi";
// import { Room } from "../../../types/room";
// import { router } from "expo-router";
// import SearchAndFilterScreen from "@/components/SearchAndFilter";

// export default function HomeScreen() {
//   const [rooms, setRooms] = useState<Room[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadDataRoom = async () => {
//       try {
//         const data = await fetchRooms();
//         setRooms(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadDataRoom();
//   }, []);

//   if (loading)
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#2E76FF" />
//       </View>
//     );

//   if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;

//   const hotRooms = rooms ? rooms.slice(0, 5) : [];
//   const standardRooms = rooms ? rooms.slice(7, 12) : [];

//   const handleViewListRoom = () => {
//     router.push("/home/listRoom");
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 16 }}
//       >
//         {/* SEARCH */}
//         <SearchAndFilterScreen />

//         {/* Phòng nổi bật 1 */}
//         <View style={styles.section}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.sectionTitle}>Phòng nổi bật</Text>
//             <TouchableOpacity onPress={handleViewListRoom}>
//               <Text style={styles.textBule}>Tất cả</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={hotRooms}
//             renderItem={({ item }) => <RoomCardVertical room={item} />}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item) => item.room_id}
//             contentContainerStyle={{ paddingHorizontal: 6 }}
//           />
//         </View>

//         {/* Phòng nổi bật 2 (nếu bạn muốn giữ nguyên) */}
//         <View style={styles.section}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.sectionTitle}>Phòng nổi bật</Text>
//             <TouchableOpacity onPress={handleViewListRoom}>
//               <Text style={styles.textBule}>Tất cả</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={standardRooms}
//             renderItem={({ item }) => <RoomCardVertical room={item} />}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item) => item.room_id}
//             contentContainerStyle={{ paddingHorizontal: 6 }}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFF",
//   },
//   error: {
//     color: "red",
//     textAlign: "center",
//     marginTop: 40,
//   },
//   section: {
//     marginBottom: 10,
//   },
//   titleContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     height: 50,
//   },
//   textBule: {
//     color: "#2E76FF",
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#1A1A1A",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import RoomCardVertical from "../../../components/RoomCardVertical";
import { fetchRooms } from "../../../api/roomApi";
import { Room } from "../../../types/room";
import SearchAndFilterScreen from "@/components/SearchAndFilter";
import { Ionicons } from "@expo/vector-icons";

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
  const recommentRooms = rooms ? rooms.slice(7, 12) : [];

  const handleViewListRoom = () => {
    router.push("/home/listRoom");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SEARCH */}
        <SearchAndFilterScreen />

        {/* ƯU ĐÃI HIỆN HÀNH */}
        <View style={styles.promoSection}>
          <View style={styles.promoHeader}>
            <Text style={styles.promoTitle}>Ưu đãi hiện hành</Text>
            <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
          </View>

          <View style={styles.promoRow}>
            {/* Thẻ bên trái: Xem tất cả khuyến mãi */}
            <TouchableOpacity style={styles.promoLeft} activeOpacity={0.9}>
              <View style={styles.percentCircle}>
                <Text style={styles.percentText}>%</Text>
              </View>
              <Text style={styles.promoLeftText}>Xem tất cả khuyến mãi</Text>
            </TouchableOpacity>

            {/* Banner bên phải */}
            <TouchableOpacity style={styles.promoRight} activeOpacity={0.9}>
              <Image
                source={require("../../../assets/images/hotel1/1.jpg")} // đổi path nếu cần
                style={styles.promoImage}
              />
              <View style={styles.promoOverlay}>
                <Text style={styles.promoRightTitle} numberOfLines={2}>
                  Bay đến Phú Quốc, khám phá đảo ngọc
                </Text>
                <Text style={styles.promoRightSub} numberOfLines={1}>
                  Ưu đãi combo nghỉ dưỡng hấp dẫn
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Phòng nổi bật 1 */}
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

        {/* Phòng nổi bật 2 (nếu bạn muốn giữ lại, có thể đổi title thành "Gợi ý hôm nay") */}
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Gợi ý hôm nay</Text>
            <TouchableOpacity onPress={handleViewListRoom}>
              <Text style={styles.textBlue}>Tất cả</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recommentRooms}
            renderItem={({ item }) => <RoomCardVertical room={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.room_id}
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
  },

  /* ƯU ĐÃI HIỆN HÀNH */
  promoSection: {
    marginTop: 12,
    marginBottom: 16,
  },
  promoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  promoRow: {
    flexDirection: "row",
  },
  promoLeft: {
    width: 110,
    backgroundColor: "#E8F1FF",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginRight: 8,
    justifyContent: "center",
    height: 120,
  },
  percentCircle: {
    width: 30,
    height: 30,
    borderRadius: 16,
    backgroundColor: "#FF5A79",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  percentText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  promoLeftText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  promoRight: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    height: 120,
    backgroundColor: "#4DA2FF",
  },
  promoImage: {
    width: "100%",
    height: "100%",       // hình lấp đầy toàn bộ promoRight
    resizeMode: "cover", 
  },
  promoOverlay: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 12,
  },
  promoRightTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 2,
  },
  promoRightSub: {
    color: "#fff",
    fontSize: 11,
  },

  /* SECTIONS PHÒNG */
  section: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  textBlue: {
    color: "#2E76FF",
    fontWeight: "500",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});


// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import BookingCard from "@/components/BookingCard";
// import HeaderScreen from "@/components/HeaderScreen";

// import { accountApi } from "@/api/accountApi";
// import { bookingApi } from "@/api/bookingApi";
// import { fetchRoomById } from "@/api/roomApi";       // <- THÊM DÒNG NÀY
// import { useAuth } from "@/src/auth/auth-store";
// import type { Booking } from "@/types/booking";
// import type { Room } from "@/types/room";           // <- THÊM DÒNG NÀY
// import axios from "axios";

// type TabKey = "upcoming" | "completed" | "cancelled";

// const TAB_LABELS: Record<TabKey, string> = {
//   upcoming: "Đang đặt",
//   completed: "Hoàn thành",
//   cancelled: "Đã hủy",
// };

// interface GroupedBookings {
//   upcoming: Booking[];
//   completed: Booking[];
//   cancelled: Booking[];
// }

// // Map room_id -> Room
// type RoomMap = Record<string, Room>;

// export default function MyBookingsScreen() {
//   const { user } = useAuth();
//   const [tab, setTab] = useState<TabKey>("upcoming");
//   const [grouped, setGrouped] = useState<GroupedBookings>({
//     upcoming: [],
//     completed: [],
//     cancelled: [],
//   });
//   const [roomMap, setRoomMap] = useState<RoomMap>({});   // <- THÊM STATE
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   useEffect(() => {
//     const loadBookings = async () => {
//       try {
//         setLoading(true);
//         setErr(null);

//         if (!user?.email) {
//           setErr("Bạn cần đăng nhập để xem lịch sử đặt phòng.");
//           setGrouped({ upcoming: [], completed: [], cancelled: [] });
//           setRoomMap({});
//           return;
//         }

//         // 1. Lấy account theo email
//         let account: any;
//         try {
//           account = await accountApi.findByEmail(user.email);
//         } catch (e: any) {
//           // Nếu BE trả 404 "Account not found" thì tạo mới account
//           if (axios.isAxiosError(e) && e.response?.status === 404) {
//             account = await accountApi.createOrGetAccount(
//               user.email,
//               user.displayName || ""
//             );
//           } else {
//             throw e;
//           }
//         }

//         const accountId: string | undefined = account?.account_id;
//         if (!accountId) {
//           setErr("Không tìm thấy account_id của bạn.");
//           setGrouped({ upcoming: [], completed: [], cancelled: [] });
//           setRoomMap({});
//           return;
//         }

//         // 2. Lấy danh sách booking theo account_id
//         const bookings = await bookingApi.getByAccount(accountId);

//         // 3. Nhóm booking theo status
//         const tmp: GroupedBookings = {
//           upcoming: [],
//           completed: [],
//           cancelled: [],
//         };

//         bookings.forEach((b) => {
//           const status = (b.status || "").toLowerCase();

//           if (["upcoming", "pending", "booking", "confirmed"].includes(status)) {
//             tmp.upcoming.push(b);
//           } else if (["completed", "done", "finished", "success"].includes(status)) {
//             tmp.completed.push(b);
//           } else if (["cancelled", "canceled"].includes(status)) {
//             tmp.cancelled.push(b);
//           } else {
//             tmp.upcoming.push(b);
//           }
//         });

//         setGrouped(tmp);

//         // 4. Lấy chi tiết room cho từng room_id để có images
//         const roomIds = Array.from(
//           new Set(
//             bookings
//               .map((b) => b.room_id)
//               .filter((id): id is string => Boolean(id))
//           )
//         );

//         if (roomIds.length === 0) {
//           setRoomMap({});
//         } else {
//           const tmpRoomMap: RoomMap = {};

//           await Promise.all(
//             roomIds.map(async (id) => {
//               try {
//                 const room = await fetchRoomById(id); // gọi /roomDetail?room_id=
//                 if (room) {
//                   tmpRoomMap[id] = room;
//                 }
//               } catch (e) {
//                 console.log("Error load room detail", id, e);
//               }
//             })
//           );

//           setRoomMap(tmpRoomMap);
//         }
//       } catch (e) {
//         console.log("Error load bookings:", e);
//         setErr("Không tải được danh sách đặt phòng. Vui lòng thử lại.");
//         setRoomMap({});
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBookings();
//   }, [user?.email]);

//   const currentData = useMemo(() => grouped[tab], [grouped, tab]);

//   // Map Booking -> data cho BookingCard
//   const renderItem = ({ item }: { item: Booking }) => {
//     const room = item.room_id ? roomMap[item.room_id] : undefined;
//     const image = room?.images?.[0] ?? ""; // lấy hình đầu tiên

//     const cardItem = {
//       id: item.booking_id,
//       name: item.hotel_info?.name ?? "Không rõ tên khách sạn",
//       location: item.hotel_info?.address ?? "",
//       price: item.total_price ?? 0,
//       rating: room?.rate ?? 4.8,
//       image, // dùng hình từ roomDetail
//     };

//     return <BookingCard item={cardItem} type={tab} />;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <HeaderScreen title="Lịch sử đặt phòng" />

//       {/* Tabs */}
//       <View style={styles.tabRow}>
//         {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
//           <TouchableOpacity
//             key={key}
//             onPress={() => setTab(key)}
//             style={styles.tabBtn}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 tab === key && styles.tabTextActive,
//               ]}
//             >
//               {TAB_LABELS[key]}
//             </Text>
//             {tab === key && <View style={styles.tabUnderline} />}
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Body: loading / error / list */}
//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//         </View>
//       ) : err ? (
//         <View style={[styles.center, { paddingHorizontal: 16 }]}>
//           <Text style={styles.errorText}>{err}</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={currentData}
//           keyExtractor={(item) =>
//             (item.booking_id || item._id || Math.random().toString()).toString()
//           }
//           renderItem={renderItem}
//           contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>
//               Không có đơn {TAB_LABELS[tab].toLowerCase()}.
//             </Text>
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F8FAFF" },
//   tabRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     borderBottomWidth: 1,
//     borderColor: "#CFCFCF",
//     marginTop: 10,
//   },
//   tabBtn: { alignItems: "center", paddingVertical: 8 },
//   tabText: { color: "#797979", fontWeight: "500" },
//   tabTextActive: { color: "#2E76FF" },
//   tabUnderline: {
//     height: 2,
//     width: 40,
//     backgroundColor: "#2E76FF",
//     marginTop: 4,
//     borderRadius: 1,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorText: {
//     color: "#DC2626",
//     textAlign: "center",
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 24,
//     color: "#6B7280",
//   },
// });


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

import BookingCard from "@/components/BookingCard";
import HeaderScreen from "@/components/HeaderScreen";

import { accountApi } from "@/api/accountApi";
import { bookingApi } from "@/api/bookingApi";
import { fetchRoomById } from "@/api/roomApi";
import { useAuth } from "@/src/auth/auth-store";
import type { Booking } from "@/types/booking";
import axios from "axios";

type TabKey = "upcoming" | "completed" | "cancelled";

const TAB_LABELS: Record<TabKey, string> = {
  upcoming: "Đang đặt",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

interface GroupedBookings {
  upcoming: Booking[];
  completed: Booking[];
  cancelled: Booking[];
}

export default function MyBookingsScreen() {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabKey>("upcoming");
  const [grouped, setGrouped] = useState<GroupedBookings>({
    upcoming: [],
    completed: [],
    cancelled: [],
  });
  const [roomImages, setRoomImages] = useState<Record<string, string | undefined>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setErr(null);

        if (!user?.email) {
          setErr("Bạn cần đăng nhập để xem lịch sử đặt phòng.");
          setGrouped({ upcoming: [], completed: [], cancelled: [] });
          return;
        }

        // 1. Lấy account theo email
        let account: any;
        try {
          account = await accountApi.findByEmail(user.email);
        } catch (e: any) {
          if (axios.isAxiosError(e) && e.response?.status === 404) {
            account = await accountApi.createOrGetAccount(
              user.email,
              user.displayName || ""
            );
          } else {
            throw e;
          }
        }

        const accountId: string | undefined = account?.account_id;
        if (!accountId) {
          setErr("Không tìm thấy account_id của bạn.");
          setGrouped({ upcoming: [], completed: [], cancelled: [] });
          return;
        }

        // 2. Lấy danh sách booking theo account_id
        const bookings = await bookingApi.getByAccount(accountId);

        // 2.1 Lấy ảnh room theo room_id
        const roomIdSet = new Set<string>();
        bookings.forEach((b) => {
          if (b.room_id) roomIdSet.add(b.room_id);
        });

        const roomIds = Array.from(roomIdSet);
        const imgMap: Record<string, string | undefined> = {};

        await Promise.all(
          roomIds.map(async (roomId) => {
            try {
              const room = await fetchRoomById(roomId);
              imgMap[roomId] = room.images?.[0];
            } catch (e) {
              console.log("Error load room for booking:", roomId, e);
            }
          })
        );
        setRoomImages(imgMap);

        // 3. Nhóm booking theo status
        const tmp: GroupedBookings = {
          upcoming: [],
          completed: [],
          cancelled: [],
        };

        bookings.forEach((b) => {
          const status = (b.status || "").toLowerCase();

          if (["upcoming", "pending", "booking", "confirmed"].includes(status)) {
            tmp.upcoming.push(b);
          } else if (["completed", "done", "finished", "success"].includes(status)) {
            tmp.completed.push(b);
          } else if (["cancelled", "canceled"].includes(status)) {
            tmp.cancelled.push(b);
          } else {
            tmp.upcoming.push(b);
          }
        });

        setGrouped(tmp);
      } catch (e) {
        console.log("Error load bookings:", e);
        setErr("Không tải được danh sách đặt phòng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user?.email]);

  const currentData = useMemo(() => grouped[tab], [grouped, tab]);

  const renderItem = ({ item }: { item: Booking }) => {
    const cardItem = {
      bookingId: item.booking_id,    // <- booking_id
      roomId: item.room_id,          // <- room_id (nếu cần dùng để lấy ảnh)
      name: item.hotel_info?.name ?? "Không rõ tên khách sạn",
      location: item.hotel_info?.address ?? "",
      price: item.total_price ?? 0,
      rating: 4.8,
      image: roomImages[item.room_id ?? ""]  // nếu bạn có map roomId -> image
    };

    return <BookingCard item={cardItem} type={tab} />;
  };


  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Lịch sử đặt phòng" />

      <View style={styles.tabRow}>
        {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setTab(key)}
            style={styles.tabBtn}
          >
            <Text
              style={[styles.tabText, tab === key && styles.tabTextActive]}
            >
              {TAB_LABELS[key]}
            </Text>
            {tab === key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : err ? (
        <View style={[styles.center, { paddingHorizontal: 16 }]}>
          <Text style={styles.errorText}>{err}</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) =>
            (item.booking_id || (item as any)._id || Math.random().toString()).toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Không có đơn {TAB_LABELS[tab].toLowerCase()}.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#CFCFCF",
    marginTop: 10,
  },
  tabBtn: { alignItems: "center", paddingVertical: 8 },
  tabText: { color: "#797979", fontWeight: "500" },
  tabTextActive: { color: "#2E76FF" },
  tabUnderline: {
    height: 2,
    width: 40,
    backgroundColor: "#2E76FF",
    marginTop: 4,
    borderRadius: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#6B7280",
  },
});

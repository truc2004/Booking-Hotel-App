// import { Ionicons } from "@expo/vector-icons";
// import React, { useEffect, useState } from "react";
// import { router } from "expo-router";
// import {
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Room } from "../types/room";
// import { Hotel } from "@/types/hotel";
// import { fetchHotelById } from "@/api/hotelApi";

// const { width } = Dimensions.get("window");

// type RoomCardProps = {
//   room: Room;
// };

// export default function RoomCard({ room }: RoomCardProps) {
//   const [favorited, setFavorited] = useState(false);
//   const [hotel, setHotel] = useState<Hotel | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadHotel = async () => {
//       try {
//         const data: Hotel = await fetchHotelById(room.hotel_id);
//         setHotel(data);
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || "Lỗi tải thông tin khách sạn");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHotel();
//   }, [room]);

//   const handleViewDetail = () => {
//     router.push(`/(tabs)/home/roomDetail?room_id=${room.room_id}`);
//   };

//   const toggleFavorite = () => {
//     setFavorited((prev) => !prev);
//   };

//   // CHỈ RENDER CARD KHI ĐÃ LOAD XONG HOTEL
//   if (loading || !hotel) {
//     return null;
//   }

//   if (error) {
//     return null;
//   }

//   return (
//     <TouchableOpacity
//       style={styles.cardContainer}
//       activeOpacity={0.9}
//       onPress={handleViewDetail}
//     >
//       <View style={styles.card}>
//         {/* Ảnh phòng */}
//         <View style={styles.imageWrapper}>
//           <Image source={{ uri: room.images[0] }} style={styles.image} />
//           {/* Nút trái tim */}
//           <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
//             <Ionicons
//               name={favorited ? "heart" : "heart-outline"}
//               size={24}
//               color={favorited ? "red" : "#fff"}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Thông tin phòng */}
//         <View style={styles.info}>
//           <View style={styles.headerInfo}>
//             <Text
//               style={styles.name}
//               numberOfLines={2}
//               ellipsizeMode="tail"
//             >
//               {hotel.name}
//             </Text>
//             <View style={styles.rating}>
//               <Ionicons name="star" size={14} color="#FFD700" />
//               <Text style={styles.ratingText}>{room.rate}</Text>
//             </View>
//           </View>

//           <View style={styles.locationContainer}>
//             <Image
//               source={require("../assets/images/icon/map.png")}
//               style={styles.iconMap}
//             />
//             <Text
//               style={styles.locationText}
//               numberOfLines={2}
//               ellipsizeMode="tail"
//             >
//               {hotel.addresses?.detailAddress}, {hotel.addresses?.district}
//             </Text>
//           </View>

//           {/* Giá + icon tiền */}
//           <View style={styles.priceRow}>
//             <Ionicons
//               name="cash-outline"
//               size={14}
//               color="#797979"
//               style={{ marginRight: 4 }}
//             />
//             <Text style={styles.price}>
//               {room.price_per_night.toLocaleString()}₫ / đêm
//             </Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   cardContainer: {
//     width: width * 0.9,
//     backgroundColor: "transparent",
//     borderRadius: 16,
//     marginVertical: 8,

//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,

//     elevation: 5,
//   },
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     overflow: "hidden",
//   },
//   imageWrapper: {
//     width: 120,
//     height: 120,
//     borderTopLeftRadius: 16,
//     borderBottomLeftRadius: 16,
//     overflow: "hidden",
//     position: "relative",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   heartButton: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     padding: 6,
//     borderRadius: 20,
//   },
//   info: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 10,
//   },
//   headerInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   name: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#222",
//     flex: 1,
//     marginRight: 8,
//   },
//   rating: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.95)",
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 8,
//   },
//   ratingText: {
//     marginLeft: 3,
//     fontWeight: "600",
//     color: "#333",
//     fontSize: 12,
//   },
//   locationContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginTop: 6,
//   },
//   iconMap: {
//     height: 16,
//     width: 16,
//     tintColor: "#797979",
//     marginRight: 5,
//     marginTop: 2,
//   },
//   locationText: {
//     fontSize: 13,
//     color: "#555",
//     flex: 1,
//   },
//   priceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 6,
//   },
//   price: {
//     color: "#27ae60",
//     fontWeight: "700",
//     fontSize: 13,
//     marginLeft: 2,
//   },
// });


import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Room } from "../types/room";
import { Hotel } from "@/types/hotel";
import { fetchHotelById } from "@/api/hotelApi";

const { width } = Dimensions.get("window");

type RoomCardProps = {
  room: Room;
};

export default function RoomCard({ room }: RoomCardProps) {
  const [favorited, setFavorited] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const data: Hotel = await fetchHotelById(room.hotel_id);
        setHotel(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Lỗi tải thông tin khách sạn");
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [room]);

  const handleViewDetail = () => {
    router.push(`/(tabs)/home/roomDetail?room_id=${room.room_id}`);
  };

  const toggleFavorite = () => {
    setFavorited((prev) => !prev);
  };

  if (loading || !hotel) return null;
  if (error) return null;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPress={handleViewDetail}
    >
      <View style={styles.card}>
        {/* Ảnh phòng */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: room.images[0] }} style={styles.image} />
          <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={24}
              color={favorited ? "red" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* Thông tin phòng */}
        <View style={styles.info}>
          <View style={styles.headerInfo}>
            <Text
              style={styles.name}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {hotel.name}
            </Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{room.rate}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Image
              source={require("../assets/images/icon/map.png")}
              style={styles.iconMap}
            />
            <Text
              style={styles.locationText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {hotel.addresses?.detailAddress}, {hotel.addresses?.district}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Ionicons
              name="cash-outline"
              size={14}
              color="#797979"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.price}>
              {room.price_per_night.toLocaleString()}₫ / đêm
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const CARD_HEIGHT = 130; // chiều cao cố định cho card

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.9,
    backgroundColor: "transparent",
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    height: CARD_HEIGHT,          // fix chiều cao
  },
  imageWrapper: {
    width: 120,
    height: "100%",               // phủ full chiều cao card
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",               // fill container
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 20,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between", // chia đều trên–dưới, không làm card cao thêm
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    marginLeft: 3,
    fontWeight: "600",
    color: "#333",
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  iconMap: {
    height: 16,
    width: 16,
    tintColor: "#797979",
    marginRight: 5,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: "#555",
    flex: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    color: "#27ae60",
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 2,
  },
});

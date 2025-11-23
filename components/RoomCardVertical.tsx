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

export default function RoomCardVertical({ room }: RoomCardProps) {
  const [liked, setLiked] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHotel = async () => {
      try {
        const data: Hotel = await fetchHotelById(room.hotel_id);
        if (!isMounted) return;
        setHotel(data);
      } catch (err: any) {
        console.error(err);
        if (!isMounted) return;
        setError(err.message || "Lỗi tải thông tin khách sạn");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    loadHotel();

    return () => {
      isMounted = false;
    };
  }, [room.hotel_id]);

  const handleLike = () => setLiked((prev) => !prev);

  const handleViewDetail = () => {
    router.push(`/(tabs)/home/roomDetail?room_id=${room.room_id}`);
  };

  // ✅ CHỈ RENDER KHI ĐÃ LOAD XONG HOTEL & KHÔNG LỖI
  if (loading || !hotel || error) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handleViewDetail}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Ảnh phòng */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: room.images[0] }} style={styles.image} />

          {/* Nút yêu thích */}
          <TouchableOpacity style={styles.heartButton} onPress={handleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "red" : "#fff"}
            />
          </TouchableOpacity>

          {/* Đánh giá */}
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{room.rate}</Text>
          </View>
        </View>

        {/* Thông tin */}
<View style={styles.info}>
  <Text
    style={styles.name}
    numberOfLines={2}
    ellipsizeMode="tail"
  >
    {hotel.name}
  </Text>

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

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.6,
    backgroundColor: "transparent",
    borderRadius: 16,
    marginBottom: 8,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 20,
  },
  rating: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 3,
    fontWeight: "600",
    color: "#333",
    fontSize: 12,
  },
   info: {
    padding: 10,
  },

  name: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
    flex: 1,           // cho phép chiếm hết chiều ngang
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",  // để text nhiều dòng vẫn đẹp
    marginTop: 4,
  },

  iconMap: {
    height: 15,
    width: 15,
    tintColor: "#797979",
    marginRight: 5,
    marginTop: 2,              // lệch nhẹ cho cân với text 2 dòng
  },

  locationText: {
    fontSize: 11,
    color: "#555",
    flex: 1,                   // cho phép wrap trong phần còn lại
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  price: {
    color: "#27ae60",
    fontWeight: "700",
    fontSize: 11,
    marginLeft: 2,
  },
});

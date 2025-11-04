import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Room } from "../types/room";

const { width } = Dimensions.get("window");

type RoomCardProps = {
  room: Room;
};

export default function RoomCardVertical({ room }: RoomCardProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => setLiked(!liked);

  const handleViewDetail = () => {
    router.push(`/(tabs)/home/roomDetail?room_id=${room.room_id}`);
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handleViewDetail}
      activeOpacity={0.9}
    >
      {/* Thẻ chính */}
      <View style={styles.card}>
        {/* Ảnh phòng */}
        <View style={styles.imageWrapper}>
          <Image
            source={{uri: room.images[0]}}
            style={styles.image}
          />

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
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>

        {/* Thông tin */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
           Golden Valley
          </Text>

          <View style={styles.locationContainer}>
            <Image
              source={require("../assets/images/icon/map.png")}
              style={styles.iconMap}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              Vũng Tàu, Hồ Chí Minh
            </Text>
          </View>

          <Text style={styles.price}>
            {room.price_per_night.toLocaleString()}₫ / đêm
          </Text>
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

    // Bóng (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Bóng (Android)
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
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  iconMap: {
    height: 16,
    width: 16,
    tintColor: "#797979",
    marginRight: 5,
  },

  locationText: {
    fontSize: 13,
    color: "#555",
    flexShrink: 1,
  },

  price: {
    color: "#27ae60",
    fontWeight: "700",
    marginTop: 6,
    fontSize: 13,
  },
});

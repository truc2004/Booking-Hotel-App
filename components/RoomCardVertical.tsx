import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
    <TouchableOpacity style={styles.cardContainer} onPress={handleViewDetail} activeOpacity={0.9}>
      <View style={styles.card}>
        {/* Ảnh phòng */}
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/hotel2/1.jpg")} style={styles.image} />
          {/* Trái tim */}
          <TouchableOpacity style={styles.heartButton} onPress={handleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "#2E76FF" : "white"}
            />
          </TouchableOpacity>
          {/* Số sao */}
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
            <Text style={styles.locationText}>Vũng Tàu, Hồ Chí Minh</Text>
          </View>
          <Text style={styles.price}>{room.price_per_night.toLocaleString()}₫ / đêm</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.6,
    marginRight: 15,
    marginBottom: 8,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
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
    backgroundColor: "rgba(255,255,255,0.9)",
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
  price: {
    color: "#27ae60",
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 13,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  iconMap: {
    height: 18,
    width: 18,
    tintColor: "#797979",
    marginRight: 5,
  },
  locationText: {
    fontSize: 13,
    color: "#555",
  },
});

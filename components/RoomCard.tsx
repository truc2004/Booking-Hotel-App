import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Room } from "../types/room";

const { width } = Dimensions.get("window");

type RoomCardProps = {
  room: Room;
};

export default function RoomCard({ room }: RoomCardProps) {
  const [favorited, setFavorited] = useState(false);

  const handleViewDetail = () => {
    router.push(`/(tabs)/home/roomDetail?room_id=${room.room_id}`);
  };

  const toggleFavorite = () => {
    setFavorited(!favorited);
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPress={handleViewDetail}
    >
      <View style={styles.card}>
        {/* Hình phòng */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/hotel1/1.jpg")}
            style={styles.image}
          />

          {/* Nút trái tim */}
          <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={26}
              color={favorited ? "#2E76FF" : "white"}
            />
          </TouchableOpacity>
        </View>

        {/* Thông tin phòng */}
        <View style={styles.info}>
          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1}>
              Golden Valley
            </Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>

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
    width: width * 0.9,
    marginVertical: 8,
    backgroundColor: "transparent",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    padding: 10,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 10,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
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
    justifyContent: "center",
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    marginRight: 5,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    marginLeft: 3,
    fontWeight: "600",
    color: "#333",
    fontSize: 13,
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

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
        {/* Ảnh phòng */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../assets/images/hotel1/1.jpg")}
            style={styles.image}
          />
          {/* Nút trái tim */}
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
            <Text style={styles.name} numberOfLines={1}>
              Golden Valley
            </Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>

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
    width: width * 0.9,
    backgroundColor: "transparent",
    borderRadius: 16,
    marginVertical: 8,

    // Bóng iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Bóng Android
    elevation: 5,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },

  imageWrapper: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
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
    justifyContent: "center",
    padding: 10,
  },

  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flexShrink: 1,
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
    alignItems: "center",
    marginTop: 6,
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

import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Room } from "../types/room";

type RoomCardProps = {
  room: Room;
};


export default function RoomCard({ room }: RoomCardProps) {

   const handleViewDetail = () => {
    // Dùng query param ?room_id=xxx
    router.push(`/roomDetail?room_id=${room.room_id}`);
  };



  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {room.amenities}
        </Text>
        <Text style={styles.price}>₫{room.price_per_night.toLocaleString()}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {room.description}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleViewDetail}>Xem chi tiết</TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 2,
    flex: 1,
    padding: 10, borderWidth: 1,
  },
  image: { width: "100%", height: 150 },
  info: { padding: 10 },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  price: { color: "green", marginBottom: 5 },
  description: { color: "#555" },
  button: {
    backgroundColor: 'pink',
    padding: 10,
    marginTop: 10,
  }
});

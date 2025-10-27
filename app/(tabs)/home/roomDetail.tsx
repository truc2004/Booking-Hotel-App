import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchRoomById } from "../../../api/roomApi";
import { Room } from "../../../types/room";

export default function RoomDetailScreen() {
  const { room_id } = useLocalSearchParams<{ room_id: string }>(); 
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = () => {
    if (!room) return;
    router.push({
      pathname: "/(tabs)/home/booking",
      params: { room_id: room.room_id, hotel_id: room.hotel_id }
    });
  };

  useEffect(() => {
    if (!room_id) return;

    const loadRoom = async () => {
      try {
        const data: Room = await fetchRoomById(room_id);
        setRoom(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [room_id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;
  if (!room) return <Text style={styles.error}>Không tìm thấy phòng</Text>;
  console.log("room", room);
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{room.room_id} - Chi tiết phòng</Text>
      <Text>Hotel ID: {room.hotel_id}</Text>
      <Text>Giá/đêm: {room.price_per_night}</Text>
      <Text>Phụ phí người lớn: {room.extra_fee_adult}</Text>
      <Text>Mô tả: {room.description}</Text>

       <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Đặt phòng</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

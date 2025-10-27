import { fetchRoomById } from "@/api/roomApi";
import { Room } from "@/types/room";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BookingScreen() {
    const { room_id, hotel_id } = useLocalSearchParams<{ room_id: string; hotel_id: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;
    if (!room) return <Text>Không tìm thấy phòng</Text>;

    // console.log(room);
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Booking Page</Text>
            <Text>Room ID: {room?.room_id}</Text>
            <Text>Hotel ID: {hotel_id}</Text>
            <Text>Giá/đêm: ₫{room?.price_per_night.toLocaleString()}</Text>
            {/* Tiếp tục form chọn ngày, số lượng người, nút thanh toán */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

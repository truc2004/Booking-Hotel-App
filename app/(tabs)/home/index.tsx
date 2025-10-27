import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import RoomCard from "../../../components/RoomCard";
import { fetchRooms } from "../../../api/roomApi";
import { Room } from "../../../types/room";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [rooms, setRooms] = useState<null | Room[]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;

  const roomList = Array.isArray((rooms as any)?.res) ? (rooms as any).res : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách phòng</Text>
 
      <FlatList
        data={roomList}
        keyExtractor={(item) => item.room_id}
        renderItem={({ item }) => <RoomCard room={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
});

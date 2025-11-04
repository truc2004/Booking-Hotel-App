import { useEffect, useState } from "react";
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomCard from "../../components/RoomCard";
import { fetchRooms } from "../../api/roomApi";
import { Room } from "../../types/room";
import { router } from "expo-router";
import ButtonBackScreen from "@/components/ButtonBackScreen";
import HeaderScreen from "@/components/HeaderScreen";

export default function FavoriteScreen() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
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

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E76FF" />
      </View>
    );

  if (error)
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Lỗi: {error}</Text>
      </View>
    );

  const favoriteRooms = rooms ? rooms.slice(0, 3) : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
        {/* Header */}
        <HeaderScreen title="Trang yêu thích"/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          favoriteRooms.length < 3 && { flex: 1 }, // nếu ít phòng thì canh giữa
        ]}
      >

        {/* Danh sách phòng */}
        <View style={styles.section}>
          <FlatList
            data={favoriteRooms}
            keyExtractor={(item) => item.room_id}
            renderItem={({ item }) => <RoomCard room={item} />}
            scrollEnabled={false}
            contentContainerStyle={styles.listCenter}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
  },
  section: {
    marginBottom: 28,
    marginTop: 20,
  },
  listCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
});

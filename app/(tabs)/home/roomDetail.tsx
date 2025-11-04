import { fetchRoomById } from "@/api/roomApi";
import ButtonBackScreen from "@/components/ButtonBackScreen";
import { Room } from "@/types/room";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  gray: "#CFCFCF",
  grayWhite: "#EFEFEF",
};

export default function ChiTietPhong() {
  const [tab, setTab] = useState<"gioithieu" | "hinhanh" | "danhgia">("gioithieu");

  const photos = [
    require("../../../assets/images/hotel1/2.jpg"),
    require("../../../assets/images/hotel1/3.jpg"),
    require("../../../assets/images/hotel1/4.jpg"),
    require("../../../assets/images/hotel1/5.jpg"),
  ];

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

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E76FF" />
      </View>
    );


  const reviews = [
    {
      id: 1,
      name: "Ngọc Trâm",
      text: "Phòng sạch sẽ, nhân viên thân thiện. Rất đáng tiền!",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: 2,
      name: "Hữu Phúc",
      text: "View đẹp, yên tĩnh, phù hợp để nghỉ dưỡng cuối tuần.",
      avatar: "https://i.pravatar.cc/100?img=22",
    },
  ];

  const renderContent = () => {
    if (tab === "gioithieu") {
      return (
        <View style={{ marginTop: 14 }}>
          <View style={styles.infoRow}>
            <Ionicons name="bed-outline" size={18} color={COLOR.blue} />
            <Text style={styles.infoText}>3 giường</Text>
            <Ionicons name="water-outline" size={18} color={COLOR.blue} />
            <Text style={styles.infoText}>1 phòng tắm</Text>
            <Ionicons name="resize-outline" size={18} color={COLOR.blue} />
            <Text style={styles.infoText}>1.848 m²</Text>
          </View>

          <Text style={styles.subTitle}>Mô tả</Text>
          <Text style={styles.desc}>
            Căn phòng được thiết kế hiện đại, đầy đủ tiện nghi với ánh sáng tự nhiên.
            Rất phù hợp cho các cặp đôi hoặc gia đình nhỏ. Bao gồm bữa sáng miễn phí.
          </Text>

          <Text style={styles.subTitle}>Liên hệ</Text>
          <View style={styles.contactRow}>
            <Ionicons name="person-outline" size={20} color={COLOR.blue} />
            <Text style={styles.infoText}>Quản lý: Nguyễn Minh</Text>
          </View>
        </View>
      );
    }

    if (tab === "hinhanh") {
      return (
        <FlatList
          data={photos}
          numColumns={2}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={item} style={styles.galleryImg} />
          )}
          contentContainerStyle={{ gap: 10, marginTop: 12 }}
          columnWrapperStyle={{ gap: 10 }}
          scrollEnabled={false}
        />
      );
    }

    if (tab === "danhgia") {
      return (
        <View style={{ marginTop: 14 }}>
          <Text style={styles.subTitle}>Đánh giá</Text>
          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewBox}>
              <Image source={{ uri: r.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewer}>{r.name}</Text>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[1]}
        renderItem={() => (
          <View>
            {/* Hình đại diện */}
            <View>
              <Image
                source={require("../../../assets/images/hotel1/1.jpg")}
                style={styles.mainImage}
              />
              <View style={styles.topIcons}>
                <ButtonBackScreen />
              </View>
            </View>

            {/* Thông tin chi tiết */}
            <View style={styles.detailWrap}>
              <Text style={styles.discount}>Giảm giá 20%</Text>
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>4.5 (365 lượt đánh giá)</Text>
                </View>
              </View>

              <Text style={styles.title}>HarborHaven Hideaway</Text>
              <Text style={styles.address}>123 Nguyễn Kiệm, Gò Vấp</Text>

              {/* Tabs */}
              <View style={styles.tabRow}>
                {[
                  { key: "gioithieu", label: "Giới thiệu" },
                  { key: "hinhanh", label: "Hình ảnh" },
                  { key: "danhgia", label: "Đánh giá" },
                ].map((t) => (
                  <TouchableOpacity key={t.key} onPress={() => setTab(t.key as any)}>
                    <Text
                      style={[
                        styles.tabText,
                        tab === t.key && styles.tabTextActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                    {tab === t.key && <View style={styles.tabUnderline} />}
                  </TouchableOpacity>
                ))}
              </View>

              {renderContent()}
            </View>
          </View>
        )}
        keyExtractor={() => "content"}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 90 }} />}
      />

      {/* Thanh dưới */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>Giá mỗi đêm</Text>
          <Text style={styles.footerValue}>1.500.000₫ / đêm</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
          <Text style={styles.bookText}>Đặt phòng ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  mainImage: { width: "100%", height: 240 },
  topIcons: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailWrap: { padding: 16 },
  discount: { color: COLOR.blue, fontWeight: "600", marginBottom: 4 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: { marginLeft: 4, color: COLOR.black, fontSize: 13 },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLOR.black,
    marginTop: 4,
  },
  address: { color: COLOR.gray, marginBottom: 8 },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: COLOR.grayWhite,
    marginTop: 8,
  },
  tabText: { color: COLOR.gray, fontWeight: "500", paddingVertical: 8 },
  tabTextActive: { color: COLOR.blue },
  tabUnderline: {
    height: 2,
    backgroundColor: COLOR.blue,
    marginTop: -6,
    borderRadius: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoText: { color: COLOR.black },
  subTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLOR.black,
    marginTop: 12,
  },
  desc: { color: COLOR.black, marginTop: 4, lineHeight: 20 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  galleryImg: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    marginTop: 15,
  },
  reviewBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLOR.grayWhite,
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  reviewer: { fontWeight: "600", color: COLOR.black },
  reviewText: { color: COLOR.black, fontSize: 13, marginTop: 2 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: COLOR.grayWhite,
    padding: 12,
    backgroundColor: "#fff",
  },
  footerPrice: { color: COLOR.gray, fontSize: 13 },
  footerValue: { color: COLOR.black, fontWeight: "700", fontSize: 15 },
  bookBtn: {
    backgroundColor: COLOR.blue,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginLeft: "auto",
  },
  bookText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

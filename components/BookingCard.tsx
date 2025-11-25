import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Hàm lấy hình (local hoặc URL)
export const getLocalImage = (path?: string) => {
  if (!path) {
    // fallback 1 ảnh
    return require("../assets/images/hotel1/1.jpg");
  }

  // Nếu là URL từ DB
  if (path.startsWith("http")) {
    return { uri: path };
  }

  // Có thể mapping thêm nếu dùng hình local
  return require("../assets/images/hotel1/1.jpg");
};

type BookingCardItem = {
  bookingId: string;     // <- booking_id
  roomId?: string;       // <- room_id (nếu cần dùng sau)
  name: string;
  location: string;
  price: number;
  rating: number;
  image?: string;
};

export default function BookingCard({
  item,
  type,
}: {
  item: BookingCardItem;
  type: "upcoming" | "completed" | "cancelled";
}) {
  const handleViewDetail = () => {
    router.push({
      pathname: "/(tabs)/home/receipt",
      params: { bookingId: item.bookingId }
    });
  };

  const handleReview = () => {
    router.push({
      pathname: "/(tabs)/home/review",   // đường dẫn tới ReviewScreen
      params: {
        bookingId: item.bookingId,
        roomId: item.roomId ?? "",
      },
    });
  };

  const handleCancel = () => {
    router.push({
      pathname: "/(tabs)/home/cancelBooking",
      params: { booking_id: item.bookingId },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Image source={getLocalImage(item.image)} style={styles.image} />

        <View style={styles.info}>
          <View style={styles.rowBetween}>
            <Text style={styles.discount}>10% OFF</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" color="#FACC15" size={14} />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Location + icon map giống mẫu RoomCardVertical */}
          <View style={styles.locationRow}>
            <Image
              source={require("../assets/images/icon/map.png")}
              style={styles.iconMap}
            />
            <Text
              style={styles.location}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.location}
            </Text>
          </View>

          {/* Price + icon tiền giống mẫu (cash-outline) */}
          <View style={styles.priceRow}>
            <Ionicons
              name="cash-outline"
              size={14}
              color="#797979"
              style={styles.moneyIcon}
            />
            <Text style={styles.price}>
              {item.price.toLocaleString("vi-VN")}đ/đêm
            </Text>
          </View>

          <View style={styles.btnRow}>
            {type === "upcoming" && (
              <>
                <TouchableOpacity
                  style={[styles.btn, styles.cancel]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.primary]}
                  onPress={handleViewDetail}
                >
                  <Text style={styles.primaryText}>Chi tiết đơn</Text>
                </TouchableOpacity>
              </>
            )}

            {type === "completed" && (
              <>
                <TouchableOpacity
                  style={[styles.btn, styles.outline]}
                  onPress={handleViewDetail}
                >
                  <Text style={styles.outlineText}>Chi tiết đơn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.primary]}
                  onPress={handleReview}
                >
                  <Text style={styles.primaryText}>Đánh giá</Text>
                </TouchableOpacity>
              </>
            )}

            {type === "cancelled" && (
              <TouchableOpacity
                style={[styles.btn, styles.primary]}
                onPress={handleViewDetail}
              >
                <Text style={styles.primaryText}>Chi tiết đơn</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {},
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    elevation: 1,
  },
  image: { width: "100%", height: 180 },
  info: { padding: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discount: { color: "#db8c15ff", fontWeight: "600", fontSize: 12 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { fontSize: 13, color: "#101010" },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#101010",
    marginTop: 4,
  },

  // location + icon (giống RoomCardVertical)
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  iconMap: {
    height: 15,
    width: 15,
    tintColor: "#797979",
    marginRight: 5,
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    color: "#555",
    flex: 1,
  },

  // price + icon
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  moneyIcon: {
    marginRight: 4,
  },
  price: {
    color: "#27ae60",        // cho đồng bộ với RoomCardVertical
    fontWeight: "700",
    fontSize: 13,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  primary: { backgroundColor: "#2E76FF" },
  primaryText: { color: "#FFFFFF", fontWeight: "600", fontSize: 13 },
  cancel: { backgroundColor: "#FF5555" },
  cancelText: { color: "#FFFFFF", fontWeight: "600", fontSize: 13 },
  outline: {
    borderWidth: 1,
    borderColor: "#2E76FF",
    backgroundColor: "#FFFFFF",
  },
  outlineText: { color: "#2E76FF", fontWeight: "600", fontSize: 13 },
});

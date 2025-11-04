import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';

// Hàm lấy hình local nếu cần
export const getLocalImage = (path: string) => {
  switch (path) {
    case "../../assets/images/hotel1/1.jpg":
      return require("../assets/images/hotel1/1.jpg");
    case "../../assets/images/hotel2/1.jpg":
      return require("../assets/images/hotel2/1.jpg");
    case "../../assets/images/hotel3/1.jpg":
      return require("../assets/images/hotel3/1.jpg");
    case "../../assets/images/hotel4/1.jpg":
      return require("../assets/images/hotel4/1.jpg");
    default:
      return { uri: path }; // Nếu là URL
  }
};

export default function BookingCard({
  item,
  type,
}: {
  item: any;
  type: "upcoming" | "completed" | "cancelled";
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Image
          source={getLocalImage(item.image)}
          style={styles.image}
        />

        <View style={styles.info}>
          <View style={styles.rowBetween}>
            <Text style={styles.discount}>10% OFF</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" color="#FACC15" size={14} />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>

          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.price}>
            {item.price}.000đ/đêm
          </Text>

          <View style={styles.btnRow}>
            {type === "upcoming" && (
              <>
                <TouchableOpacity style={[styles.btn, styles.cancel]}>
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.primary]}>
                  <Text style={styles.primaryText}>Chi tiết</Text>
                </TouchableOpacity>
              </>
            )}

            {type === "completed" && (
              <>
                <TouchableOpacity style={[styles.btn, styles.outline]}>
                  <Text style={styles.outlineText}>Đặt lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.primary]}>
                  <Text style={styles.primaryText}>Đánh giá</Text>
                </TouchableOpacity>
              </>
            )}

            {type === "cancelled" && (
              <TouchableOpacity style={[styles.btn, styles.primary]}>
                  <Text style={styles.primaryText}>Đặt lại</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { marginBottom: 12 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    elevation: 1,
  },
  image: { width: "100%", height: 130 },
  info: { padding: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  discount: { color: "#2E76FF", fontWeight: "600", fontSize: 12 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { fontSize: 13, color: "#101010" },
  title: { fontSize: 16, fontWeight: "600", color: "#101010", marginTop: 4 },
  location: { fontSize: 13, color: "#555" },
  price: { color: "#101010", fontWeight: "600", marginTop: 4 },
  perNight: { color: "#CFCFCF" },
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  btn: { flex: 1, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginHorizontal: 4 },
  primary: { backgroundColor: "#2E76FF" },
  primaryText: { color: "#FFFFFF", fontWeight: "600" },
  cancel: { backgroundColor: "#EFEFEF" },
  cancelText: { color: "#101010", fontWeight: "600" },
  outline: { borderWidth: 1, borderColor: "#2E76FF", backgroundColor: "#FFFFFF" },
  outlineText: { color: "#2E76FF", fontWeight: "600" },
  cancelledText: { color: "#2E76FF", textAlign: "center", marginTop: 8, fontWeight: "600" },
});

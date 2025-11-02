import HeaderScreen from "@/components/HeaderScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  grayWhite: "#EFEFEF",
  white: "#FFFFFF",
};

export default function PaymentScreen() {
  const handlePay = () => {
    router.push("/(tabs)/home/order"); // chỗ thanh toán
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Phương thức thanh toán" />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Thẻ tín dụng / ghi nợ</Text>

        <TouchableOpacity style={styles.cardRow} onPress={handlePay}>
          <View style={styles.cardLeft}>
            <Ionicons name="card-outline" size={22} color={COLOR.blue} />
            <Text style={styles.cardText}>Thêm thẻ mới</Text>
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Tùy chọn khác
        </Text>

        <TouchableOpacity style={styles.cardRow} onPress={handlePay}>
          <View style={styles.cardLeft}>
            <Ionicons name="logo-paypal" size={22} color={COLOR.blue} />
            <Text style={styles.cardText}>Paypal</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardRow} onPress={handlePay}>
          <View style={styles.cardLeft}>
            <Ionicons name="logo-apple" size={22} color={COLOR.black} />
            <Text style={styles.cardText}>Apple Pay</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },
  content: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLOR.black,
    marginBottom: 14,
  },
  cardRow: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EAEAEB",
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardLeft: { flexDirection: "row", gap: 12, alignItems: "center" },
  cardText: { fontSize: 15, color: COLOR.black },
});

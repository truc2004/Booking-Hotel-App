import { bookingApi } from "@/api/bookingApi";
import HeaderScreen from "@/components/HeaderScreen";
import type { Booking } from "@/types/booking";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  primary: "#2E76FF",
  black: "#1A1A1A",
  darkGray: "#4A4A4A",
  gray: "#8E8E93",
  lightGray: "#C7C7CC",
  background: "#F8FAFF",
  white: "#FFFFFF",
  success: "#34C759",
};

function SimpleBarcode({ value }: { value: string }) {
  const bars = [];
  const chars = value.split("");

  for (let i = 0; i < 40; i++) {
    const charCode = chars[i % chars.length].charCodeAt(0);
    const width = (charCode % 3) + 2;
    const isBar = i % 2 === 0;

    bars.push(
      <View
        key={i}
        style={{
          width: width * 2,
          height: 60,
          backgroundColor: isBar ? COLOR.black : "transparent",
        }}
      />
    );
  }

  return (
    <View style={styles.barcodeWrapper}>
      <View style={styles.barcodeContainer2}>{bars}</View>
      <Text style={styles.barcodeText}>{value}</Text>
    </View>
  );
}

function InfoRow({
  label,
  value,
  labelStyle,
  valueStyle,
}: {
  label: string;
  value: string;
  labelStyle?: any;
  valueStyle?: any;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, labelStyle]}>{label}</Text>
      <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
    </View>
  );
}

export default function ReceiptScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!bookingId) {
          setErr("Không có mã đơn đặt phòng.");
          setLoading(false);
          return;
        }
        const data = await bookingApi.getById(bookingId.toString());
        setBooking(data);
      } catch (e) {
        console.log("Error load booking detail:", e);
        setErr("Không tìm thấy đơn đặt phòng.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookingId]);

  const handleDownload = () => {
    Alert.alert("Tải xuống", "Hóa đơn điện tử đã được lưu vào thiết bị của bạn", [
      { text: "OK" },
    ]);
  };

  const handleGoOrder = () => {
    router.push("/(tabs)/home/order");
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.primary} />
        <Text style={styles.loadingText}>Đang tải hóa đơn...</Text>
      </View>
    );
  }

  if (err || !booking) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLOR.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hóa đơn điện tử</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.loadingContainer, { paddingHorizontal: 20 }]}>
          <Text style={styles.loadingText}>
            {err || "Không tìm thấy hóa đơn."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const hotelName = booking.hotel_info?.name ?? "Không rõ tên khách sạn";
  // const bookingDateObj = new Date(booking.booking_date);
  // const bookingDate = bookingDateObj.toLocaleDateString("vi-VN");
  // const bookingDateCheckIn = booking.check_in_date.toLocaleDateString("vi-VN");
  // const bookingDateCheckOut = booking.check_out_date.toLocaleDateString("vi-VN");
  // const bookingTime = bookingDateObj.toLocaleTimeString("vi-VN", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });
  const bookingDateObj = new Date(booking.booking_date);
  const bookingDate = bookingDateObj.toLocaleDateString("vi-VN");
  const bookingTime = bookingDateObj.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Nếu có check_in_date / check_out_date -> dùng, nếu không có -> fallback bookingDate
  const checkInDate = booking.check_in_date
    ? new Date(booking.check_in_date).toLocaleDateString("vi-VN")
    : bookingDate;

  const checkOutDate = booking.check_out_date
    ? new Date(booking.check_out_date).toLocaleDateString("vi-VN")
    : bookingDate;

  const totalGuests = (booking.num_adults ?? 0) + (booking.num_children ?? 0);

  const amount = booking.room_price ?? booking.total_price ?? 0;
  const taxFees = booking.extra_fee ?? 0;
  const total = booking.total_price ?? amount + taxFees;

  const customerName = booking.user_booking_info?.full_name ?? "";
  const phoneNumber = booking.user_booking_info?.phone ?? "";
  const transactionId = booking.booking_id;
  const email = booking.user_booking_info?.email ?? "";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} >
          <Ionicons name="arrow-back" size={24} color={COLOR.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hóa đơn điện tử</Text>
        <View style={{ width: 40 }} />
      </View>  */}
      <HeaderScreen title="Hóa đơn điện tử" />


      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          {/* Barcode */}
          <View style={styles.barcodeContainerOuter}>
            <SimpleBarcode value={transactionId} />
          </View>

          {/* Hotel Info */}
          <View style={styles.section}>
            <InfoRow
              label="Khách sạn"
              value={hotelName}
              valueStyle={styles.boldValue}
            />
          </View>

          {/* Booking Details */}

          <View style={styles.section}>
            <InfoRow
              label="Ngày đặt"
              value={`${bookingDate} | ${bookingTime}`}
            />
            <InfoRow label="Ngày nhận phòng" value={checkInDate} />
            <InfoRow label="Ngày trả phòng" value={checkOutDate} />
            <InfoRow label="Số khách" value={`${totalGuests} khách`} />
          </View>


          <View style={styles.divider} />

          {/* Customer Info */}
          <View style={styles.section}>
            <InfoRow label="Tên khách" value={customerName} />
            <InfoRow label="Số điện thoại" value={phoneNumber} />
            <InfoRow label="Email" value={email} />

          </View>

          <View style={styles.divider} />

          {/* Payment Details */}
          <View style={styles.section}>
            <InfoRow
              label="Tiền phòng"
              value={`${amount.toLocaleString("vi-VN")}đ`}
            />
            <InfoRow
              label="Thuế & phí"
              value={`${taxFees.toLocaleString("vi-VN")}đ`}
            />
          </View>

          <View style={styles.divider} />

          {/* Total */}
          <View style={styles.section}>
            <InfoRow
              label="Tổng thanh toán"
              value={`${total.toLocaleString("vi-VN")}đ`}
              valueStyle={styles.totalValue}
              labelStyle={styles.totalLabel}
            />
          </View>
        </View>

        {/* Action Buttons – chỉ còn nút Tải xuống */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.downloadButtonAlt}
            onPress={handleDownload}
            activeOpacity={0.8}
          >
            <Ionicons name="download-outline" size={20} color={COLOR.white} />
            <Text style={styles.downloadButtonText}>Tải xuống hóa đơn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLOR.gray,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLOR.white,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.lightGray + "30",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLOR.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  receiptCard: {
    backgroundColor: COLOR.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  barcodeContainerOuter: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLOR.white,
    borderRadius: 12,
  },
  barcodeWrapper: {
    alignItems: "center",
  },
  barcodeContainer2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    gap: 1,
  },
  barcodeText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
    color: COLOR.black,
    letterSpacing: 3,
  },
  section: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: COLOR.gray,
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 12,
    color: COLOR.black,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  boldValue: {
    fontWeight: "700",
    fontSize: 12,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLOR.black,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "800",
    color: COLOR.primary,
  },
  transactionId: {
    color: COLOR.primary,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: COLOR.lightGray + "50",
    marginVertical: 16,
  },
  actionButtons: {
    marginTop: 24,
  },
  downloadButtonAlt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  downloadButtonText: {
    color: COLOR.white,
    fontSize: 13,
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLOR.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLOR.lightGray + "30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  footerButtonText: {
    color: COLOR.white,
    fontSize: 12,
    fontWeight: "700",
  },
});

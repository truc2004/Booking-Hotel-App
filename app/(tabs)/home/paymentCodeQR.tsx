import HeaderScreen from "@/components/HeaderScreen";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentQRScreen() {
  const router = useRouter();
  const { totalAmount, bookingData } = useLocalSearchParams<{
    totalAmount?: string;
    bookingData?: string;
  }>();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parse booking payload
  let bookingPayload: any = null;
  try {
    if (bookingData) {
      bookingPayload = JSON.parse(bookingData as string);
    }
  } catch (e) {
    console.error("Invalid bookingData JSON:", e);
  }

  useEffect(() => {
    if (!bookingPayload) {
      Alert.alert("Lỗi", "Thiếu dữ liệu đặt phòng (bookingData).");
      return;
    }

    // Giả lập: sau 5 giây → thanh toán thành công + lưu booking
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.post("https://hotel-mobile-be.onrender.com/hotel/bookings", {
          ...bookingPayload,
          status: "upcoming",
        });

        router.replace("/(tabs)/home/paymentSuccess");
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          console.log("Booking error response:", err.response?.data);
          console.log("Booking error status:", err.response?.status);
          Alert.alert(
            "Lỗi",
            `Lưu đơn đặt phòng thất bại: ${
              err.response?.data?.message || err.message
            }`
          );
        } else {
          console.log("Unknown error:", err);
          Alert.alert(
            "Lỗi",
            "Lưu đơn đặt phòng thất bại (lỗi không xác định)."
          );
        }
      }
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [bookingData]);

  const amountNumber = Number(totalAmount || 0);

   return (
    <SafeAreaView style={styles.root}>
      <HeaderScreen title="Mã QR thanh toán" />

      <View style={styles.container}>
        {/* Phần trên nền xanh */}
        <View style={styles.topSection}>
          <Text style={styles.topTitle}>Thanh toán bằng QR</Text>
          <Text style={styles.topHint}>
            Vui lòng mở ứng dụng ngân hàng để quét mã
          </Text>

          {/* Thẻ trắng chứa QR */}
          <View style={styles.qrCard}>
            <View style={styles.qrBox}>
              {/* QR giả lập */}
              <View style={styles.qrFakeOuter}>
                <View style={styles.qrFakeInner} />
              </View>
            </View>

            {/* Thông tin số tiền cần thanh toán */}
            <View style={styles.qrInfoContainer}>
              <Text style={styles.qrAmountLabel}>Số tiền cần thanh toán</Text>
              <Text style={styles.qrAmountValue}>
                {amountNumber.toLocaleString()}đ
              </Text>
            </View>
          </View>
        </View>

        {/* Phần dưới: thông tin tài khoản nhận */}
        <View style={styles.bottomSection}>
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Tên tài khoản nhận</Text>
            <View style={styles.inputLike}>
              <Text style={styles.inputText}>CÔNG TY DU LỊCH BOOKING HOTEL</Text>
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Số tài khoản nhận</Text>
            <View style={styles.inputLike}>
              <Text style={styles.inputText}>1234 5678 9999</Text>
            </View>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Hoặc chuyển khoản trực tiếp</Text>
            <Text style={styles.noteText}>
              Quý khách có thể chuyển khoản trực tiếp theo thông tin trên hoặc
              thanh toán tiền mặt tại quầy lễ tân.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tình trạng</Text>
            <Text style={styles.infoValue}>Đang chờ xác nhận thanh toán…</Text>
          </View>
          <View style={styles.infoRowLast}>
            <Text style={styles.infoLabel}>Ghi chú</Text>
            <Text style={styles.infoValue}>
              Hệ thống sẽ tự động xác nhận sau vài giây.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  // Phần trên màu xanh
  topSection: {
    backgroundColor: "#0A7AFF",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  topHint: {
    fontSize: 13,
    color: "#E5F0FF",
    marginBottom: 16,
    textAlign: "center",
  },

  // Thẻ QR trắng
  qrCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  qrBox: {
    width: 220,
    height: 220,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  qrFakeOuter: {
    width: 160,
    height: 160,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  qrFakeInner: {
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
  },

  qrInfoContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  qrAmountLabel: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  qrAmountValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  // Phần dưới
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  inputLike: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  inputText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },

  noteBox: {
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#E5F2FF",
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D4ED8",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 16,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  infoRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: "#4B5563",
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
});
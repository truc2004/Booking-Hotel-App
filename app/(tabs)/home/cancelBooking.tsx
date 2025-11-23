// app/(tabs)/home/cancelBooking.tsx
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bookingApi } from "@/api/bookingApi";

const COLOR = {
  primary: "#2E76FF",
  black: "#1A1A1A",
  darkGray: "#4A4A4A",
  gray: "#8E8E93",
  lightGray: "#C7C7CC",
  background: "#F8FAFF",
  white: "#FFFFFF",
  danger: "#FF3B30",
};

const CANCEL_REASONS = [
  {
    id: "address_not_suitable",
    label: "Hotel address not suitable",
    label_vi: "Địa chỉ khách sạn không phù hợp",
  },
  {
    id: "no_longer_need",
    label: "No longer need the booking",
    label_vi: "Tôi không có nhu cầu nữa",
  },
  {
    id: "schedule_change",
    label: "Schedule changed",
    label_vi: "Thay đổi lịch trình",
  },
  {
    id: "wrong_booking",
    label: "Wrong booking",
    label_vi: "Đặt nhầm",
  },
  {
    id: "price_issue",
    label: "Price is not suitable",
    label_vi: "Giá không phù hợp",
  },
  { id: "other", label: "Other", label_vi: "Lý do khác" },
];

export default function CancelBooking() {
  const params = useLocalSearchParams<{ booking_id: string }>();
  const [selectedReason, setSelectedReason] = useState<string>(
    "address_not_suitable"
  );
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const buildFinalReason = () => {
    if (selectedReason === "other") return otherReason.trim();
    const found = CANCEL_REASONS.find((r) => r.id === selectedReason);
    return found ? found.label_vi : "Không xác định";
  };

  const handleConfirmCancel = async () => {
  try {
    setLoading(true);
    const finalReason = buildFinalReason();

    console.log(
      ">>> call bookingApi.cancel with",
      params.booking_id,
      finalReason
    );

    const res = await bookingApi.cancel(
      params.booking_id as string,
      finalReason
    );

    console.log(">>> cancel success, booking =", res);

    setLoading(false);
    setShowConfirm(false);

    Alert.alert(
      "Hủy thành công",
      "Đơn đặt phòng đã được hủy. Số tiền hoàn (nếu có) sẽ được xử lý trong 6–7 ngày làm việc. Vui lòng kiểm tra email để xem chi tiết.",
      [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)/historyBooking");
          },
        },
      ]
    );
  } catch (err: any) {
    console.error(">>> cancel booking error:", err?.message);

    if (err?.response) {
      console.log(">>> cancel error status =", err.response.status);
      console.log(">>> cancel error data   =", err.response.data);
    }

    setLoading(false);
    setShowConfirm(false);
    Alert.alert("Lỗi", "Không thể hủy đặt phòng. Vui lòng thử lại sau.");
  }
};

const handleCancelBooking = () => {
  console.log(">>> handleCancelBooking pressed, params =", params);

  if (selectedReason === "other" && !otherReason.trim()) {
    Alert.alert("Thông báo", "Vui lòng nhập lý do hủy");
    return;
  }

  if (!params.booking_id) {
    Alert.alert("Lỗi", "Không tìm thấy mã đặt phòng để hủy.");
    return;
  }

  // Chỉ mở modal confirm đẹp, không dùng Alert.confirm nữa
  setShowConfirm(true);
};


//   const handleCancelBooking = () => {
//   console.log(">>> handleCancelBooking pressed, params =", params);

//   if (selectedReason === "other" && !otherReason.trim()) {
//     Alert.alert("Thông báo", "Vui lòng nhập lý do hủy");
//     return;
//   }

//   if (!params.booking_id) {
//     Alert.alert("Lỗi", "Không tìm thấy mã đặt phòng để hủy.");
//     return;
//   }

//   Alert.alert(

//     "Xác nhận hủy đặt phòng",
//     "Bạn có chắc chắn muốn hủy đặt phòng này không?",
//     [
//       { text: "Không", style: "cancel" },
//       {
//         text: "Hủy đặt phòng",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             setLoading(true);
//             const finalReason = buildFinalReason();

//             console.log(
//               ">>> call bookingApi.cancel with",
//               params.booking_id,
//               finalReason
//             );

//             const res = await bookingApi.cancel(
//               params.booking_id as string,
//               finalReason
//             );

//             console.log(">>> cancel success, booking =", res);

//             setLoading(false);
//             Alert.alert(
//               "Hủy thành công",
//               "Đơn đặt phòng đã được hủy. Số tiền hoàn (nếu có) sẽ được xử lý trong 6–7 ngày làm việc. Vui lòng kiểm tra email để xem chi tiết.",
//               [
//                 {
//                   text: "OK",
//                   onPress: () => {
//                     // nên dùng replace để quay về và tránh stack dày
//                     router.replace("/(tabs)/historyBooking");
//                   },
//                 },
//               ]
//             );
//           } catch (err: any) {
//             console.error(">>> cancel booking error:", err?.message);

//             // Nếu là lỗi từ axios thì log thêm chi tiết
//             if (err?.response) {
//               console.log(">>> cancel error status =", err.response.status);
//               console.log(">>> cancel error data   =", err.response.data);
//             }

//             setLoading(false);
//             Alert.alert(
//               "Lỗi",
//               "Không thể hủy đặt phòng. Vui lòng thử lại sau."
//             );
//           }
//         },
//       },
//     ]
//   );

  
// };

// cach 2
// const handleCancelBooking = async () => {
//     // bỏ Alert, chỉ check đơn giản
//     if (selectedReason === "other" && !otherReason.trim()) {
//       console.log("Vui lòng nhập lý do hủy");
//       return;
//     }

//     try {
//       setLoading(true);
//       const finalReason = buildFinalReason();

//       console.log(
//         ">>> call bookingApi.cancel with",
//         params.booking_id,
//         finalReason
//       );

//       const res = await bookingApi.cancel(
//         params.booking_id as string,
//         finalReason
//       );

//       console.log(">>> cancel success, booking =", res);
   
//       setLoading(false);

//       // nếu muốn test điều hướng luôn thì giữ dòng này, không thì comment
//       // router.replace("/(tabs)/historyBooking");
//     } catch (err: any) {
//       console.error(">>> cancel booking error:", err?.message);
//       if (err?.response) {
//         console.log(">>> cancel error status =", err.response.status);
//         console.log(">>> cancel error data   =", err.response.data);
//       }
//       setLoading(false);
//     }
//   };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLOR.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hủy đặt phòng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instruction}>
          Vui lòng chọn lý do hủy đặt phòng:
        </Text>

        {/* Reasons List */}
        <View style={styles.reasonsList}>
          {CANCEL_REASONS.map((reason) => (
            <TouchableOpacity
              key={reason.id}
              style={styles.reasonItem}
              onPress={() => setSelectedReason(reason.id)}
              activeOpacity={0.7}
            >
              <View style={styles.radioOuter}>
                {selectedReason === reason.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <View style={styles.reasonContent}>
                <Text style={styles.reasonLabel}>{reason.label_vi}</Text>
                <Text style={styles.reasonLabelVi}>{reason.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Reason Input */}
        {selectedReason === "other" && (
          <View style={styles.otherSection}>
            <Text style={styles.otherLabel}>Lý do khác</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập lý do hủy..."
                placeholderTextColor={COLOR.lightGray}
                value={otherReason}
                onChangeText={setOtherReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        )}

        {/* Booking Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="information-circle"
              size={20}
              color={COLOR.primary}
            />
            <Text style={styles.infoHeaderText}>Thông tin đặt phòng</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã đặt phòng:</Text>
            <Text style={styles.infoValue}>
              #{params.booking_id?.padStart(6, "0")}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái hiện tại:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Đang đặt</Text>
            </View>
          </View>
        </View>
      </ScrollView>

            {/* Confirm Cancel Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => !loading && setShowConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* <View style={styles.modalIconWrapper}> */}
              {/* <View style={styles.modalIconCircle}>
                <Ionicons
                  name="alert-circle"
                  size={32}
                  color={COLOR.danger}
                />
              </View>
            </View> */}

            <Text style={styles.modalTitle}>Xác nhận hủy đặt phòng</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắc chắn muốn hủy đơn đặt phòng này không? Hành động này
              không thể hoàn tác. Nếu đủ điều kiện, số tiền hoàn (nếu có) sẽ
              được xử lý trong 6–7 ngày làm việc.
            </Text>

            <View style={styles.modalBookingIdRow}>
              <Text style={styles.modalBookingLabel}>Mã đặt phòng</Text>
              <Text style={styles.modalBookingValue}>
                #{params.booking_id?.slice(-8).toUpperCase()}
              </Text>
            </View>

            <View style={styles.modalButtonsRow}>
              {/* Nút hủy / quay lại */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonSecondary,
                  loading && styles.modalButtonDisabled,
                ]}
                activeOpacity={0.8}
                onPress={() => !loading && setShowConfirm(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Quay lại</Text>
              </TouchableOpacity>

              {/* Nút xác nhận hủy */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonPrimary,
                  loading && styles.modalButtonDisabled,
                ]}
                activeOpacity={0.8}
                onPress={handleConfirmCancel}
                disabled={loading}
              >
                <Text style={styles.modalButtonPrimaryText}>
                  {loading ? "Đang xử lý..." : "Hủy đặt phòng"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cancelButton, loading && styles.cancelButtonDisabled]}
          onPress={handleCancelBooking}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <>
              <Ionicons
                name="hourglass-outline"
                size={20}
                color={COLOR.white}
              />
              <Text style={styles.cancelButtonText}>Đang xử lý...</Text>
            </>
          ) : (
            <>
              <Ionicons name="close-circle" size={20} color={COLOR.white} />
              <Text style={styles.cancelButtonText}>Xác nhận hủy đặt phòng</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
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
    paddingBottom: 100,
  },
  instruction: {
    fontSize: 14,
    color: COLOR.gray,
    marginBottom: 16,
  },
  reasonsList: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLOR.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLOR.primary,
  },
  reasonContent: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLOR.black,
    marginBottom: 2,
  },
  reasonLabelVi: {
    fontSize: 13,
    color: COLOR.gray,
  },
  otherSection: {
    marginBottom: 20,
  },
  otherLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLOR.black,
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.lightGray + "50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    padding: 16,
    fontSize: 15,
    color: COLOR.black,
    minHeight: 120,
  },
  infoCard: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.lightGray + "30",
  },
  infoHeaderText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLOR.black,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLOR.gray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLOR.black,
  },
  statusBadge: {
    backgroundColor: COLOR.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLOR.primary,
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
    zIndex: 999,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.danger,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  cancelButtonDisabled: {
    backgroundColor: COLOR.gray,
  },
  cancelButtonText: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: "700",
  },
    modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLOR.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 10,
  },
  modalIconWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFECEC",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLOR.black,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  modalMessage: {
    fontSize: 13,
    color: COLOR.darkGray,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 12,
  },
  modalBookingIdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLOR.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  modalBookingLabel: {
    fontSize: 12,
    color: COLOR.gray,
  },
  modalBookingValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLOR.black,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 4,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  modalButtonSecondary: {
    backgroundColor: COLOR.white,
    borderColor: COLOR.lightGray,
  },
  modalButtonPrimary: {
    backgroundColor: COLOR.danger,
    borderColor: COLOR.danger,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLOR.darkGray,
  },
  modalButtonPrimaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLOR.white,
  },

});

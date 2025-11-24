import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useAuth } from "@/src/auth/auth-store"; // chỉnh path nếu khác
import { accountApi } from "@/api/accountApi";   // chỉnh path nếu khác
import {
  fetchMyReview,
  createReviewApi,
  updateReviewApi,
} from "@/api/reviewApi";                        // chỉnh path nếu khác
import { fetchRoomById } from "@/api/roomApi";   // chỉnh path nếu khác
import { bookingApi } from "@/api/bookingApi";   // THÊM: chỉnh path nếu khác

const COLOR = {
  primary: "#2E76FF",
  secondary: "#5B9EFF",
  black: "#1A1A1A",
  darkGray: "#4A4A4A",
  gray: "#8E8E93",
  lightGray: "#C7C7CC",
  background: "#F8FAFF",
  white: "#FFFFFF",
  gold: "#FFD700",
  danger: "#FF3B30",
};

export default function ReviewScreen() {
  const { bookingId, roomId } = useLocalSearchParams<{
    bookingId?: string;
    roomId?: string;
  }>();

  const { user } = useAuth();

  const [account, setAccount] = useState<any | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  const [booking, setBooking] = useState<any | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);

  const [room, setRoom] = useState<any | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loadingReview, setLoadingReview] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // LẤY accountId an toàn theo nhiều field
  const accountId =
    (account &&
      (account.account_id || account.id || account._id)) ||
    null;

  // 1) Tìm account trong DB theo email Firebase
  useEffect(() => {
    const loadAccount = async () => {
      try {
        if (!user?.email) {
          setLoadingAccount(false);
          return;
        }

        const acc = await accountApi.findByEmail(user.email);
        setAccount(acc);
      } catch (err) {
        console.log("loadAccount error:", err);
      } finally {
        setLoadingAccount(false);
      }
    };

    loadAccount();
  }, [user?.email]);

  // 2) Lấy thông tin booking theo bookingId
  useEffect(() => {
    const loadBooking = async () => {
      try {
        if (!bookingId) {
          setLoadingBooking(false);
          return;
        }

        const data = await bookingApi.getById(bookingId as string);
        setBooking(data);
      } catch (err) {
        console.log("loadBooking error:", err);
      } finally {
        setLoadingBooking(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  // 3) Lấy thông tin room theo roomId (để dùng rate, images, fallback giá...)
  useEffect(() => {
    const loadRoom = async () => {
      try {
        if (!roomId) {
          setLoadingRoom(false);
          return;
        }

        const data = await fetchRoomById(roomId as string);
        setRoom(data);
      } catch (err) {
        console.log("loadRoom error:", err);
      } finally {
        setLoadingRoom(false);
      }
    };

    loadRoom();
  }, [roomId]);

  // 4) Lấy review của riêng user đó cho roomId
  useEffect(() => {
    const loadMyReview = async () => {
      if (!accountId || !roomId) {
        setLoadingReview(false);
        return;
      }

      try {
        const myReview = await fetchMyReview(accountId, roomId as string);
        if (myReview) {
          setIsEditMode(true);
          setRating(myReview.rating ?? 0);
          setReview(myReview.comment || "");
        } else {
          setIsEditMode(false);
        }
      } catch (error) {
        console.log("loadMyReview error:", error);
      } finally {
        setLoadingReview(false);
      }
    };

    if (!loadingAccount) {
      loadMyReview();
    }
  }, [accountId, roomId, loadingAccount]);

  const handleSubmit = async () => {
    if (!accountId || !roomId) {
      Alert.alert("Lỗi", "Không xác định được tài khoản hoặc phòng.");
      return;
    }

    if (rating === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn số sao đánh giá");
      return;
    }

    if (review.trim() === "") {
      Alert.alert("Thông báo", "Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      if (isEditMode) {
        await updateReviewApi({
          account_id: accountId,
          room_id: roomId as string,
          rating,
          comment: review.trim(),
        });

        Alert.alert("Thành công", "Đã cập nhật đánh giá của bạn!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await createReviewApi({
          account_id: accountId,
          room_id: roomId as string,
          rating,
          comment: review.trim(),
        });

        Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error?.message || "Gửi đánh giá thất bại");
    }
  };

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  if (loadingAccount || loadingReview || loadingRoom || loadingBooking) {
   
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#2E76FF" />
          </View>
        );
  }

  // ======= DỮ LIỆU HIỂN THỊ TỪ BOOKING =======

  // Ảnh: ưu tiên room_image trong booking, fallback room.images[0]
  const headerImageSource =
    booking?.room_image
      ? { uri: booking.room_image }
      : room?.images && room.images.length > 0
      ? { uri: room.images[0] }
      : require("../../../assets/images/hotel1/3.jpg");

  // Tên khách sạn
  const hotelName =
    booking?.hotel_name ||
    booking?.hotel?.name ||
    "Khách sạn";

  // Địa chỉ khách sạn
  const hotelAddress =
    booking?.hotel_address ||
    booking?.hotel?.address ||
    "";

  // Giá phòng: ưu tiên trong booking, fallback room.price_per_night
  const roomPriceNumber =
    booking?.room_price ??
    booking?.price_per_night ??
    room?.price_per_night;

  const roomPriceText =
    typeof roomPriceNumber === "number"
      ? `${roomPriceNumber.toLocaleString("vi-VN")}đ/đêm`
      : "";

  // Rating trung bình của phòng (nếu có)
  const roomRateText =
    typeof room?.rate === "number" ? room.rate.toFixed(1) : "--";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header với ảnh phòng/khách sạn */}
        <View style={styles.headerImageContainer}>
          <Image
            source={headerImageSource}
            style={styles.headerImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLOR.black} />
          </TouchableOpacity>

          <View style={styles.gradientOverlay} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
         

          {/* Chọn sao */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isEditMode
                ? "Chỉnh sửa đánh giá của bạn"
                : "Đánh giá tổng thể về phòng này"}
            </Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  activeOpacity={0.7}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={30}
                    color={star <= rating ? COLOR.gold : COLOR.lightGray}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Comment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nhận xét chi tiết</Text>
            <TextInput
              style={styles.reviewInput}
              multiline
              numberOfLines={6}
              value={review}
              onChangeText={setReview}
              placeholder="Nhập nhận xét của bạn..."
              placeholderTextColor={COLOR.gray}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Nút Submit */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (rating === 0 || review.trim() === "") &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.7}
            disabled={rating === 0 || review.trim() === ""}
          >
            <Text style={styles.submitButtonText}>
              {isEditMode ? "Cập nhật đánh giá" : "Gửi đánh giá"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImageContainer: {
    position: "relative",
    height: 200,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 2,
    backgroundColor: COLOR.white,
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  scrollContainer: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: COLOR.white,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  discountRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  discount: {
    backgroundColor: "#FF6B35",
    color: COLOR.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: "600",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#856404",
    fontWeight: "500",
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLOR.black,
    marginBottom: 4,
  },
  hotelAddress: {
    fontSize: 13,
    color: COLOR.gray,
  },
  hotelPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLOR.primary,
    marginTop: 6,
  },
  section: {
    backgroundColor: COLOR.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLOR.darkGray,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: COLOR.lightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: COLOR.black,
    backgroundColor: COLOR.background,
    minHeight: 120,
    textAlignVertical: "top",
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    backgroundColor: COLOR.white,
    borderTopWidth: 1,
    borderTopColor: COLOR.lightGray + "40",
  },
  submitButton: {
    backgroundColor: COLOR.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLOR.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonDisabled: {
    backgroundColor: COLOR.lightGray,
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLOR.white,
  },
});

import { fetchHotelById } from "@/api/hotelApi";
import { fetchReviewsByRoom } from "@/api/reviewApi";
import { fetchRoomById } from "@/api/roomApi";
import ButtonBackScreen from "@/components/ButtonBackScreen";
import { Hotel } from "@/types/hotel";
import { Review } from "@/types/review";
import { Room } from "@/types/room";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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
  success: "#34C759",
  discount: "#FF3B30",
};

type TabKey = "gioithieu" | "hinhanh" | "danhgia";

const FALLBACK_PHOTOS = [
  require("../../../assets/images/hotel1/2.jpg"),
  require("../../../assets/images/hotel1/3.jpg"),
  require("../../../assets/images/hotel1/4.jpg"),
  require("../../../assets/images/hotel1/5.jpg"),
];


// tách amenities từ chuỗi "WiFi, Jacuzzi, Ban công"
const parseAmenities = (amenitiesString?: string | string[]) => {
  if (!amenitiesString) return [];
  if (Array.isArray(amenitiesString)) return amenitiesString;
  return amenitiesString
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export default function ChiTietPhong() {
  const [tab, setTab] = useState<TabKey>("gioithieu");

  const { room_id } = useLocalSearchParams<{ room_id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleBooking = () => {
    if (!room) return;
    router.push({
      pathname: "/(tabs)/home/booking",
      params: {
        room_id: room.room_id,
        hotel_id: room.hotel_id,
        rate: room.rate?.toString() ?? "0",
      },
    });
  };

  useEffect(() => {
    if (!room_id) return;

    const loadAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Lấy room
        const roomData = await fetchRoomById(room_id);
        setRoom(roomData);

        // 2. Lấy song song hotel + reviews
        const [hotelData, reviewsData] = await Promise.all([
          fetchHotelById(roomData.hotel_id),
          fetchReviewsByRoom(room_id),
        ]);

        setHotel(hotelData);
        setReviews(reviewsData ?? []);
      } catch (err: any) {
        console.log("Error load room detail:", err);
        setError(err?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [room_id]);

  // xử lý list ảnh: nếu room.images có thì dùng, không thì dùng fallback
  const photoSources = useMemo(() => {
    if (room && Array.isArray((room as any).images) && (room as any).images.length > 0) {
      return (room as any).images as string[];
    }
    return FALLBACK_PHOTOS;
  }, [room]);

  // main image
  const mainImageSource = useMemo(() => {
    const first = photoSources[0];
    if (!first) return require("../../../assets/images/hotel1/1.jpg");
    if (typeof first === "string") return { uri: first };
    return first; // require(...)
  }, [photoSources]);

  // amenities
  const amenitiesList = useMemo(() => {
    const raw = parseAmenities((room as any)?.amenities);
    if (!raw.length) {
      return [
        { icon: "bed-outline", label: "Giường thoải mái", color: COLOR.primary },
        { icon: "water-outline", label: "Phòng tắm riêng", color: COLOR.secondary },
        { icon: "wifi-outline", label: "WiFi miễn phí", color: COLOR.primary },
      ];
    }
    // map text -> icon đơn giản
    return raw.map((label) => {
      let icon: string = "pricetag-outline";
      if (label.toLowerCase().includes("wifi")) icon = "wifi-outline";
      else if (label.toLowerCase().includes("giường")) icon = "bed-outline";
      else if (label.toLowerCase().includes("tắm")) icon = "water-outline";
      else if (label.toLowerCase().includes("ban công")) icon = "sunny-outline";
      return { icon, label, color: COLOR.primary };
    });
  }, [room]);

  // amenities có kèm số giường
  const amenitiesWithBed = useMemo(() => {
    const base = [...amenitiesList];

    if (room?.bed_count && room.bed_count > 0) {
      base.unshift({
        icon: "bed-outline",
        label: `${room.bed_count} giường`,
        color: COLOR.primary,
      });
    }

    return base;
  }, [amenitiesList, room]);


  // rating từ reviews
  const { avgRating, totalReviews } = useMemo(() => {
    if (!reviews || reviews.length === 0)
      return { avgRating: 0, totalReviews: 0 };
    const sum = reviews.reduce((acc, r: any) => acc + (r.rating || 0), 0);
    const avg = sum / reviews.length;
    return { avgRating: Number(avg.toFixed(1)), totalReviews: reviews.length };
  }, [reviews]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.primary} />
        <Text style={styles.loadingText}>Đang tải thông tin phòng...</Text>
      </View>
    );
  }

  if (error || !room) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{error || "Không tìm thấy thông tin phòng."}</Text>
      </View>
    );
  }

  // --------- RENDER CONTENT THEO TAB ----------

  const renderContent = () => {
    if (tab === "gioithieu") {
      return (
        <View style={styles.contentSection}>

          {/* Tiện nghi từ dữ liệu + số giường */}
          <View style={styles.amenitiesGrid}>
            {amenitiesWithBed.map((item, index) => (
              <View key={index} style={styles.amenityCard}>
                <View
                  style={[
                    styles.amenityIcon,
                    { backgroundColor: item.color + "15" },
                  ]}
                >
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={styles.amenityText}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Mô tả từ room.description */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={COLOR.primary}
              />
              <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
            </View>
            <Text style={styles.description}>
              {room.description || "Phòng khách sạn tiện nghi, phù hợp nghỉ dưỡng."}
            </Text>
          </View>

          {/* Chính sách đặt phòng */}
          {/* Chính sách đặt phòng */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={COLOR.primary}
              />
              <Text style={styles.sectionTitle}>Chính sách đặt phòng</Text>
            </View>

            <View style={styles.policyBlock}>
              <Text style={styles.policyBlockTitle}>
                1. Thanh toán & thời gian lưu trú
              </Text>
              <Text style={styles.policyItemText}>
                • Thanh toán toàn bộ khi xác nhận đặt phòng (trừ tùy chọn “đặt trước trả sau” nếu có).
              </Text>
              <Text style={styles.policyItemText}>
                • Lưu trú tối thiểu 1 đêm, tối đa 30 đêm; lưu trú dài hơn cần chia booking hoặc liên hệ khách sạn.
              </Text>
            </View>

            <View style={styles.policyBlock}>
              <Text style={styles.policyBlockTitle}>
                2. Số lượng khách
              </Text>
              <Text style={styles.policyItemText}>
                • Số khách phải phù hợp với loại phòng (ví dụ: phòng đôi: 2 người lớn + 1 trẻ em &lt; 6 tuổi miễn phí).
              </Text>
              <Text style={styles.policyItemText}>
                • Khách thêm sẽ phụ thu khoảng 200.000 – 500.000 VND/người/đêm, tùy chính sách khách sạn.
              </Text>
            </View>

            <View style={styles.policyBlock}>
              <Text style={styles.policyBlockTitle}>
                3. Hủy đặt phòng
              </Text>
              <Text style={styles.policyItemText}>
                • Hủy trước 48 giờ so với giờ check-in: hoàn 100% giá trị đặt phòng.
              </Text>
              <Text style={styles.policyItemText}>
                • Hủy trong 24–48 giờ trước check-in: mất 50% giá trị đặt phòng.
              </Text>
              <Text style={styles.policyItemText}>
                • Hủy dưới 24 giờ: mất 100% (không hoàn tiền), trừ một số trường hợp bất khả kháng có chứng từ.
              </Text>
            </View>

            <View style={styles.policyBlock}>
              <Text style={styles.policyBlockTitle}>
                4. Chỉnh sửa & hoàn tiền
              </Text>
              <Text style={styles.policyItemText}>
                • Có thể chỉnh sửa ngày check-in/check-out miễn phí nếu thực hiện trước 7 ngày so với ngày mới.
              </Text>
              <Text style={styles.policyItemText}>
                • Sau 7 ngày có thể phát sinh phí ~20% giá trị đặt phòng; tối đa 2 lần chỉnh sửa cho mỗi booking.
              </Text>
              <Text style={styles.policyItemText}>
                • Hoàn tiền được xử lý trong vòng 7 ngày làm việc; giá đã bao gồm VAT 10% và phí dịch vụ 5%.
              </Text>
            </View>
          </View>


          {/* Liên hệ từ hotel (nếu có) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={22} color={COLOR.primary} />
              <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            </View>
            <View style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <Ionicons name="business-outline" size={24} color={COLOR.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Khách sạn</Text>
                <Text style={styles.contactName}>
                  {hotel?.name || "Đang cập nhật"}
                </Text>
                {hotel?.phone && (
                  <Text style={styles.contactLabel}>SĐT: {hotel.phone}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (tab === "hinhanh") {
      return (
        <View style={styles.contentSection}>
          <FlatList
            data={photoSources}
            numColumns={2}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => {
              const source =
                typeof item === "string" ? { uri: item } : (item as any);
              return (
                <View style={styles.galleryItemWrapper}>
                  <Image source={source} style={styles.galleryImage} />

                </View>
              );
            }}
            contentContainerStyle={styles.galleryContainer}
            columnWrapperStyle={styles.galleryRow}
            scrollEnabled={false}
          />
        </View>
      );
    }

    if (tab === "danhgia") {
      return (
        <View style={styles.contentSection}>
          <View style={styles.ratingOverview}>
            <View style={styles.ratingScore}>
              <Text style={styles.ratingNumber}>
                {totalReviews ? avgRating : "-"}
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={
                      star <= Math.floor(avgRating)
                        ? "star"
                        : star - avgRating < 1 && star - avgRating > 0
                          ? "star-half"
                          : "star-outline"
                    }
                    size={16}
                    color={COLOR.gold}
                  />
                ))}
              </View>
              <Text style={styles.ratingCount}>
                {totalReviews
                  ? `${totalReviews} đánh giá`
                  : "Chưa có đánh giá"}
              </Text>
            </View>
          </View>

          {totalReviews === 0 ? (
            <Text style={styles.loadingText}>
              Chưa có đánh giá nào cho phòng này.
            </Text>
          ) : (
            reviews.map((r: any) => (
              <View key={r._id || r.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg" }}
                    style={styles.reviewAvatar}
                  />

                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewerName}>
                      {r.name || r.reviewer_name || "Khách ẩn danh"}
                    </Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={
                            star <= (r.rating || 0) ? "star" : "star-outline"
                          }
                          size={14}
                          color={COLOR.gold}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>
                  {r.comment || r.text || ""}
                </Text>
              </View>
            ))
          )}
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
            {/* Hình đại diện với gradient overlay */}
            <View style={styles.imageContainer}>
              <ButtonBackScreen />
              <Image source={mainImageSource} style={styles.mainImage} />
              <LinearGradient
                colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.6)"]}
                style={styles.imageGradient}
              />
            </View>

            {/* Thông tin chi tiết */}
            <View style={styles.detailContainer}>
              {/* Header info */}
              <View style={styles.headerInfo}>
                <View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={16} color={COLOR.gold} />
                    <Text style={styles.ratingText}>
                      {totalReviews ? avgRating : "-"}
                    </Text>
                    {totalReviews > 0 && (
                      <Text style={styles.ratingCount2}>
                        ({totalReviews})
                      </Text>
                    )}
                  </View>
                  <Text style={styles.hotelTitle}>
                    {hotel?.name || "Tên phòng / khách sạn"}
                  </Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={16} color={COLOR.gray} />
                    <Text style={styles.address}>
                      {hotel?.addresses?.detailAddress || "Địa chỉ đang cập nhật"}, {hotel?.addresses?.district}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tabs */}
              <View style={styles.tabContainer}>
                {[
                  {
                    key: "gioithieu",
                    label: "Giới thiệu",
                    icon: "information-circle-outline",
                  },
                  {
                    key: "hinhanh",
                    label: "Hình ảnh",
                    icon: "images-outline",
                  },
                  { key: "danhgia", label: "Đánh giá", icon: "star-outline" },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.key}
                    style={[
                      styles.tabButton,
                      tab === t.key && styles.tabButtonActive,
                    ]}
                    onPress={() => setTab(t.key as TabKey)}
                  >
                    <Ionicons
                      name={t.icon as any}
                      size={18}
                      color={tab === t.key ? COLOR.white : COLOR.gray}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        tab === t.key && styles.tabLabelActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {renderContent()}
            </View>
          </View>
        )}
        keyExtractor={() => "content"}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Giá mỗi đêm</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>
              {room.price_per_night.toLocaleString()}
            </Text>
            <Text style={styles.priceUnit}>/đêm</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleBooking} style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Đặt phòng ngay</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLOR.gray,
    fontSize: 14,
    textAlign: "center",
  },
  imageContainer: {
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: 300,
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  topBar: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 70,
    right: 16,
    backgroundColor: COLOR.discount,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  discountText: {
    color: COLOR.white,
    fontWeight: "700",
    fontSize: 14,
  },
  detailContainer: {
    backgroundColor: COLOR.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerInfo: {
    marginBottom: 20,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLOR.gold + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    color: COLOR.black,
    fontWeight: "700",
    fontSize: 13,
  },
  ratingCount2: {
    color: COLOR.gray,
    fontSize: 13,
  },
  hotelTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLOR.black,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  address: {
    color: COLOR.gray,
    fontSize: 14,
    flexShrink: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: COLOR.primary,
  },
  tabLabel: {
    color: COLOR.gray,
    fontWeight: "600",
    fontSize: 13,
  },
  tabLabelActive: {
    color: COLOR.white,
  },
  contentSection: {
    paddingBottom: 20,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  amenityCard: {
    width: (width - 56) / 2,
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  amenityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  amenityText: {
    color: COLOR.black,
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLOR.black,
  },
  description: {
    color: COLOR.darkGray,
    fontSize: 13,
    lineHeight: 24,
  },
  policyBlock: {
    backgroundColor: COLOR.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  policyBlockTitle: {
    fontSize: 13,      // tiêu đề mỗi mục
    fontWeight: "700",
    color: COLOR.black,
    marginBottom: 4,
  },
  policyItemText: {
    color: COLOR.darkGray,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
    marginLeft: 10
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLOR.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    color: COLOR.gray,
    fontSize: 11,
    marginBottom: 2,
  },
  contactName: {
    color: COLOR.black,
    fontWeight: "700",
    fontSize: 13,
  },
  galleryContainer: {
    gap: 12,
  },
  galleryRow: {
    gap: 12,
  },
  galleryItemWrapper: {
    flex: 1,
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    marginBottom: 15
  },
  imageOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingOverview: {
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  ratingScore: {
    alignItems: "center",
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: "800",
    color: COLOR.black,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  ratingCount: {
    color: COLOR.gray,
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontWeight: "700",
    color: COLOR.black,
    fontSize: 15,
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    color: COLOR.darkGray,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLOR.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLOR.lightGray + "50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceSection: {
    flex: 1,
    justifyContent: "center",
  },
  priceLabel: {
    color: COLOR.gray,
    fontSize: 13,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceValue: {
    color: "#27ae60",
    fontWeight: "800",
    fontSize: 20,
  },
  priceUnit: {
    color: COLOR.gray,
    fontSize: 14,
    marginLeft: 4,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
    minWidth: 160,
    backgroundColor: "#2E76FF",
  },
  bookButtonText: {
    color: COLOR.white,
    fontWeight: "700",
    fontSize: 16,
  },
});

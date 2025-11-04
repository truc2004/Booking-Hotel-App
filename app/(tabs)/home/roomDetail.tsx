import { fetchRoomById } from "@/api/roomApi";
import ButtonBackScreen from "@/components/ButtonBackScreen";
import { Room } from "@/types/room";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.primary} />
        <Text style={styles.loadingText}>Đang tải thông tin phòng...</Text>
      </View>
    );

  const reviews = [
    {
      id: 1,
      name: "Ngọc Trâm",
      text: "Phòng sạch sẽ, nhân viên thân thiện. Rất đáng tiền!",
      avatar: "https://i.pravatar.cc/100?img=12",
      rating: 5,
    },
    {
      id: 2,
      name: "Hữu Phúc",
      text: "View đẹp, yên tĩnh, phù hợp để nghỉ dưỡng cuối tuần.",
      avatar: "https://i.pravatar.cc/100?img=22",
      rating: 4,
    },
  ];

  const amenities = [
    { icon: "bed-outline", label: "3 giường", color: COLOR.primary },
    { icon: "water-outline", label: "1 phòng tắm", color: COLOR.secondary },
    { icon: "resize-outline", label: "1.848 m²", color: COLOR.success },
    { icon: "wifi-outline", label: "WiFi miễn phí", color: COLOR.primary },
  ];

  const renderContent = () => {
    if (tab === "gioithieu") {
      return (
        <View style={styles.contentSection}>
          {/* Tiện nghi */}
          <View style={styles.amenitiesGrid}>
            {amenities.map((item, index) => (
              <View key={index} style={styles.amenityCard}>
                <View style={[styles.amenityIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={styles.amenityText}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Mô tả */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={22} color={COLOR.primary} />
              <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
            </View>
            <Text style={styles.description}>
              Căn phòng được thiết kế hiện đại, đầy đủ tiện nghi với ánh sáng tự nhiên.
              Rất phù hợp cho các cặp đôi hoặc gia đình nhỏ. Bao gồm bữa sáng miễn phí.
            </Text>
          </View>

          {/* Liên hệ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={22} color={COLOR.primary} />
              <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            </View>
            <View style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <Ionicons name="person" size={24} color={COLOR.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Quản lý</Text>
                <Text style={styles.contactName}>Nguyễn Minh</Text>
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
            data={photos}
            numColumns={2}
            keyExtractor={(item, i) => i.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.galleryItemWrapper}>
                <Image source={item} style={styles.galleryImage} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="expand-outline" size={20} color={COLOR.white} />
                </View>
              </View>
            )}
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
              <Text style={styles.ratingNumber}>4.5</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name={star <= 4 ? "star" : "star-half"} 
                    size={16} 
                    color={COLOR.gold} 
                  />
                ))}
              </View>
              <Text style={styles.ratingCount}>365 đánh giá</Text>
            </View>
          </View>

          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>{r.name}</Text>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star} 
                        name={star <= r.rating ? "star" : "star-outline"} 
                        size={14} 
                        color={COLOR.gold} 
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
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
            {/* Hình đại diện với gradient overlay */}
            <View style={styles.imageContainer}>
              <Image
                source={require("../../../assets/images/hotel1/1.jpg")}
                style={styles.mainImage}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
                style={styles.imageGradient}
              />
              <View style={styles.topBar}>
                <ButtonBackScreen />
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="heart-outline" size={24} color={COLOR.white} />
                </TouchableOpacity>
              </View>
              
              {/* Discount badge */}
              <View style={styles.discountBadge}>
                <Ionicons name="pricetag" size={16} color={COLOR.white} />
                <Text style={styles.discountText}>-20%</Text>
              </View>
            </View>

            {/* Thông tin chi tiết */}
            <View style={styles.detailContainer}>
              {/* Header info */}
              <View style={styles.headerInfo}>
                <View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={16} color={COLOR.gold} />
                    <Text style={styles.ratingText}>4.5</Text>
                    <Text style={styles.ratingCount2}>(365)</Text>
                  </View>
                  <Text style={styles.hotelTitle}>HarborHaven Hideaway</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={16} color={COLOR.gray} />
                    <Text style={styles.address}>123 Nguyễn Kiệm, Gò Vấp</Text>
                  </View>
                </View>
              </View>

              {/* Tabs với design mới */}
              <View style={styles.tabContainer}>
                {[
                  { key: "gioithieu", label: "Giới thiệu", icon: "information-circle-outline" },
                  { key: "hinhanh", label: "Hình ảnh", icon: "images-outline" },
                  { key: "danhgia", label: "Đánh giá", icon: "star-outline" },
                ].map((t) => (
                  <TouchableOpacity 
                    key={t.key} 
                    style={[
                      styles.tabButton,
                      tab === t.key && styles.tabButtonActive
                    ]}
                    onPress={() => setTab(t.key as any)}
                  >
                    <Ionicons 
                      name={t.icon as any} 
                      size={18} 
                      color={tab === t.key ? COLOR.white : COLOR.gray} 
                    />
                    <Text style={[
                      styles.tabLabel,
                      tab === t.key && styles.tabLabelActive
                    ]}>
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

      {/* Footer với gradient */}
      <View style={styles.footer}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Giá mỗi đêm</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>1.500.000₫</Text>
            <Text style={styles.priceUnit}>/đêm</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleBooking}>
          <LinearGradient
            colors={[COLOR.primary, COLOR.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>Đặt phòng ngay</Text>
            <Ionicons name="arrow-forward" size={20} color={COLOR.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLOR.background 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLOR.gray,
    fontSize: 14,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: { 
    width: '100%', 
    height: 300,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    backdropFilter: 'blur(10px)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: COLOR.discount,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  discountText: {
    color: COLOR.white,
    fontWeight: '700',
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLOR.gold + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    color: COLOR.black,
    fontWeight: '700',
    fontSize: 14,
  },
  ratingCount2: {
    color: COLOR.gray,
    fontSize: 13,
  },
  hotelTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLOR.black,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  address: {
    color: COLOR.gray,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: COLOR.primary,
  },
  tabLabel: {
    color: COLOR.gray,
    fontWeight: '600',
    fontSize: 13,
  },
  tabLabelActive: {
    color: COLOR.white,
  },
  contentSection: {
    paddingBottom: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  amenityCard: {
    width: (width - 56) / 2,
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  amenityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    color: COLOR.black,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.black,
  },
  description: {
    color: COLOR.darkGray,
    fontSize: 15,
    lineHeight: 24,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLOR.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    color: COLOR.gray,
    fontSize: 13,
    marginBottom: 2,
  },
  contactName: {
    color: COLOR.black,
    fontWeight: '700',
    fontSize: 16,
  },
  galleryContainer: {
    gap: 12,
  },
  galleryRow: {
    gap: 12,
  },
  galleryItemWrapper: {
    flex: 1,
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingOverview: {
    backgroundColor: COLOR.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  ratingScore: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: COLOR.black,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '700',
    color: COLOR.black,
    fontSize: 15,
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    color: COLOR.darkGray,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLOR.lightGray + '50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    color: COLOR.gray,
    fontSize: 13,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    color: COLOR.black,
    fontWeight: '800',
    fontSize: 20,
  },
  priceUnit: {
    color: COLOR.gray,
    fontSize: 14,
    marginLeft: 4,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  bookButtonText: {
    color: COLOR.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderScreen from "@/components/HeaderScreen";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  success: "#34C759",
  warning: "#FF9500",
  danger: "#FF3B30",
  gold: "#FFD700",
};

// Mapping key tiếng Anh -> nhãn hiển thị tiếng Việt
const TAB_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  upcoming: { label: "Đang đặt", icon: "time-outline", color: COLOR.warning },
  completed: { label: "Hoàn thành", icon: "checkmark-circle-outline", color: COLOR.success },
  cancelled: { label: "Đã hủy", icon: "close-circle-outline", color: COLOR.danger },
};

// Dữ liệu sample
const DATA = {
  upcoming: [
    { 
      id: 1, 
      name: "GoldenValley", 
      location: "123 Nguyễn Kiệm, Gò Vấp", 
      price: 150, 
      rating: 4.9, 
      image: require("../../assets/images/hotel1/1.jpg"),
      checkIn: "10 Nov 2024",
      checkOut: "12 Nov 2024",
      guests: 2,
      nights: 2,
      roomId: "room_001",
      hotelId: "hotel_001",
    },
    { 
      id: 2, 
      name: "Sunrise Hotel", 
      location: "456 Lê Văn Việt, Q9", 
      price: 200, 
      rating: 4.7, 
      image: require("../../assets/images/hotel1/2.jpg"),
      checkIn: "15 Nov 2024",
      checkOut: "17 Nov 2024",
      guests: 3,
      nights: 2,
      roomId: "room_002",
      hotelId: "hotel_002",
    },
  ],
  completed: [
    { 
      id: 3, 
      name: "HarborHaven Hideaway", 
      location: "123 Nguyễn Kiệm, Gò Vấp", 
      price: 700, 
      rating: 4.8, 
      image: require("../../assets/images/hotel1/3.jpg"),
      checkIn: "04 Oct 2024",
      checkOut: "03 Nov 2024",
      guests: 5,
      nights: 30,
      roomId: "room_003",
      hotelId: "hotel_003",
    },
  ],
  cancelled: [
    { 
      id: 5, 
      name: "GreenView", 
      location: "123 Nguyễn Kiệm, Gò Vấp", 
      price: 320, 
      rating: 4.6, 
      image: require("../../assets/images/hotel1/4.jpg"),
      checkIn: "01 Dec 2024",
      checkOut: "05 Dec 2024",
      guests: 2,
      nights: 4,
      roomId: "room_005",
      hotelId: "hotel_005",
    },
  ],
};

export default function MyBookingsScreen() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  const handleViewDetails = (bookingId: number) => {
    router.push({
      pathname: "/(tabs)/home/receipt",
      params: { booking_id: bookingId }
    });
  };

  const handleCancelBooking = (bookingId: number) => {
    router.push({
      pathname: "/(tabs)/home/cancelBooking",
      params: { booking_id: bookingId }
    });
  };

  const handleBookAgain = (roomId: string, hotelId: string) => {
    // Navigate to booking page with room and hotel details
    router.push({
      pathname: "/(tabs)/home/booking",
      params: { 
        room_id: roomId,
        hotel_id: hotelId
      }
    });
  };

  const handleReview = (bookingId: number) => {
    // Navigate to review page
    router.push({
      pathname: "/(tabs)/home/review",
      params: { booking_id: bookingId }
    });
  };

  const renderBookingCard = ({ item }: { item: any }) => {
    const statusColor = tab === "upcoming" ? COLOR.warning : tab === "completed" ? COLOR.success : COLOR.danger;
    const statusBg = statusColor + '15';
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Ionicons 
              name={TAB_LABELS[tab].icon as any} 
              size={16} 
              color={statusColor} 
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {TAB_LABELS[tab].label}
            </Text>
          </View>
          <Text style={styles.bookingId}>#{item.id.toString().padStart(6, '0')}</Text>
        </View>

        <View style={styles.cardContent}>
          <Image source={item.image} style={styles.hotelImage} />
          
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName} numberOfLines={1}>{item.name}</Text>
            
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={COLOR.gray} />
              <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
            </View>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={COLOR.gold} />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={14} color={COLOR.gray} />
                <Text style={styles.infoText}>{item.checkIn}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="moon-outline" size={14} color={COLOR.gray} />
                <Text style={styles.infoText}>{item.nights} đêm</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Tổng tiền</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>${item.price * item.nights}</Text>
              <Text style={styles.priceUnit}>({item.nights} đêm)</Text>
            </View>
          </View>

          <View style={styles.actions}>
            {tab === "upcoming" && (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => handleCancelBooking(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.detailButton]}
                  onPress={() => handleViewDetails(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.detailButtonText}>Chi tiết</Text>
                </TouchableOpacity>
              </>
            )}
            
            {tab === "completed" && (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.bookAgainButton]}
                  onPress={() => handleBookAgain(item.roomId, item.hotelId)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.bookAgainButtonText}>Đặt lại</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.detailButton]}
                  onPress={() => handleReview(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.detailButtonText}>Đánh giá</Text>
                </TouchableOpacity>
              </>
            )}
            
            {tab === "cancelled" && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.detailButton]}
                onPress={() => handleBookAgain(item.roomId, item.hotelId)}
                activeOpacity={0.7}
              >
                <Text style={styles.detailButtonText}>Đặt lại</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons 
          name={TAB_LABELS[tab].icon as any} 
          size={64} 
          color={COLOR.lightGray} 
        />
      </View>
      <Text style={styles.emptyTitle}>Chưa có đơn đặt phòng</Text>
      <Text style={styles.emptyText}>
        {tab === "upcoming" && "Bạn chưa có đơn đặt phòng nào đang chờ"}
        {tab === "completed" && "Bạn chưa hoàn thành đơn đặt phòng nào"}
        {tab === "cancelled" && "Bạn chưa hủy đơn đặt phòng nào"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderScreen title="Lịch sử đặt phòng" />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {Object.entries(TAB_LABELS).map(([key, info]) => (
          <TouchableOpacity 
            key={key} 
            onPress={() => setTab(key as any)} 
            style={[
              styles.tab,
              tab === key && styles.tabActive
            ]}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={info.icon as any} 
              size={20} 
              color={tab === key ? COLOR.white : COLOR.gray} 
            />
            <Text style={[
              styles.tabText, 
              tab === key && styles.tabTextActive
            ]}>
              {info.label}
            </Text>
            {tab === key && DATA[key].length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{DATA[key].length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Booking list */}
      <FlatList
        data={DATA[tab]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookingCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLOR.background 
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  tabActive: {
    backgroundColor: COLOR.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLOR.gray,
  },
  tabTextActive: {
    color: COLOR.white,
  },
  badge: {
    backgroundColor: COLOR.white,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLOR.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bookingId: {
    fontSize: 13,
    fontWeight: '600',
    color: COLOR.gray,
  },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  hotelImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.black,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: COLOR.gray,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: COLOR.black,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLOR.darkGray,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLOR.lightGray + '30',
    marginTop: 12,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: COLOR.gray,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLOR.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: COLOR.gray,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 4,
  },
  cancelButton: {
    backgroundColor: COLOR.danger + '15',
    borderWidth: 1,
    borderColor: COLOR.danger + '50',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.danger,
  },
  detailButton: {
    backgroundColor: COLOR.primary,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.white,
  },
  bookAgainButton: {
    backgroundColor: COLOR.white,
    borderWidth: 1.5,
    borderColor: COLOR.primary,
  },
  bookAgainButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLOR.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.black,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLOR.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});
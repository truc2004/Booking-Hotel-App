
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ReceiptScreen() {

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

  interface BookingData {
    hotel_name: string;
    booking_date: string;
    booking_time: string;
    check_in: string;
    check_out: string;
    guest_count: number;
    amount: number;
    tax_fees: number;
    total: number;
    customer_name: string;
    phone_number: string;
    transaction_id: string;
  }


  // Simple Barcode Component using View
  function SimpleBarcode({ value }: { value: string }) {
    // Generate simple barcode pattern based on transaction ID
    const generateBars = () => {
      const bars = [];
      const chars = value.split('');

      // Create barcode pattern
      for (let i = 0; i < 40; i++) {
        const charCode = chars[i % chars.length].charCodeAt(0);
        const width = (charCode % 3) + 2; // Width between 2-4
        const isBar = i % 2 === 0; // Alternate bars and spaces

        bars.push(
          <View
            key={i}
            style={{
              width: width * 2,
              height: 60,
              backgroundColor: isBar ? COLOR.black : 'transparent',
            }}
          />
        );
      }

      return bars;
    };

    return (
      <View style={styles.barcodeWrapper}>
        <View style={styles.barcodeContainer2}>
          {generateBars()}
        </View>
        <Text style={styles.barcodeText}>{value}</Text>
      </View>
    );
  }

  function EReceipt() {
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

    useEffect(() => {
      // Simulate loading booking data
      setTimeout(() => {
        setBookingData({
          hotel_name: "HarborHaven Hideaway",
          booking_date: "August 24, 2023",
          booking_time: "10:00 AM",
          check_in: "October 04, 2023",
          check_out: "November 03, 2023",
          guest_count: 5,
          amount: 650.00,
          tax_fees: 5.00,
          total: 700.00,
          customer_name: "Esther Howard",
          phone_number: "+1 (208) 555-0112",
          transaction_id: "RE2564HG23",
        });
        setLoading(false);
      }, 800);
    }, []);

    const handleDownload = () => {
      Alert.alert(
        "Tải xuống",
        "E-Receipt đã được lưu vào thiết bị của bạn",
        [{ text: "OK" }]
      );
    };

    const handleSubmit = () => {
      router.push({
        pathname: "/(tabs)/home/order",
      });
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

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLOR.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>E-Receipt</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Receipt Card */}
          <View style={styles.receiptCard}>
            {/* Barcode */}
            <View style={styles.barcodeContainerOuter}>
              <SimpleBarcode value={bookingData?.transaction_id || "RE2564HG23"} />
            </View>

            {/* Hotel Info */}
            <View style={styles.section}>
              <InfoRow
                label="Hotel Name"
                value={bookingData?.hotel_name || ""}
                valueStyle={styles.boldValue}
              />
            </View>

            {/* Booking Details */}
            <View style={styles.section}>
              <InfoRow
                label="Booking Date"
                value={`${bookingData?.booking_date} | ${bookingData?.booking_time}`}
              />
              <InfoRow label="Check In" value={bookingData?.check_in || ""} />
              <InfoRow label="Check Out" value={bookingData?.check_out || ""} />
              <InfoRow label="Guest" value={`${bookingData?.guest_count} Person`} />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Payment Details */}
            <View style={styles.section}>
              <InfoRow
                label="Amount"
                value={`$${bookingData?.amount.toFixed(2)}`}
              />
              <InfoRow
                label="Tax & Fees"
                value={`$${bookingData?.tax_fees.toFixed(2)}`}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Total */}
            <View style={styles.section}>
              <InfoRow
                label="Total"
                value={`$${bookingData?.total.toFixed(2)}`}
                valueStyle={styles.totalValue}
                labelStyle={styles.totalLabel}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Customer Info */}
            <View style={styles.section}>
              <InfoRow label="Name" value={bookingData?.customer_name || ""} />
              <InfoRow label="Phone Number" value={bookingData?.phone_number || ""} />
              <InfoRow
                label="Transaction ID"
                value={bookingData?.transaction_id || ""}
                valueStyle={styles.transactionId}
              />
            </View>
          </View>

          {/* Success Icon */}
          <View style={styles.successContainer}>
            <View style={styles.successIconWrapper}>
              <View style={styles.successIconBg}>
                <Ionicons name="checkmark-circle" size={64} color={COLOR.success} />
              </View>
            </View>
            <Text style={styles.successText}>Đặt phòng thành công!</Text>
            <Text style={styles.successSubtext}>
              Hóa đơn điện tử đã được tạo
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.viewOrderButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Ionicons name="receipt-outline" size={20} color={COLOR.primary} />
              <Text style={styles.viewOrderButtonText}>Xem đơn hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.downloadButtonAlt}
              onPress={handleDownload}
              activeOpacity={0.8}
            >
              <Ionicons name="download-outline" size={20} color={COLOR.white} />
              <Text style={styles.downloadButtonText}>Tải xuống</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.footerButtonText}>Về trang đơn hàng</Text>
            <Ionicons name="arrow-forward" size={20} color={COLOR.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Component for info rows
  function InfoRow({
    label,
    value,
    labelStyle,
    valueStyle
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


  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: COLOR.background,
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: COLOR.white,
      borderBottomWidth: 1,
      borderBottomColor: COLOR.lightGray + '30',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: COLOR.black,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 120,
    },
    receiptCard: {
      backgroundColor: COLOR.white,
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    barcodeContainerOuter: {
      alignItems: 'center',
      marginBottom: 24,
      paddingVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: COLOR.background,
      borderRadius: 12,
    },
    barcodeWrapper: {
      alignItems: 'center',
    },
    barcodeContainer2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 60,
      gap: 1,
    },
    barcodeText: {
      marginTop: 12,
      fontSize: 14,
      fontWeight: '700',
      color: COLOR.black,
      letterSpacing: 3,
    },
    section: {
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: 14,
      color: COLOR.gray,
      fontWeight: '500',
      flex: 1,
    },
    infoValue: {
      fontSize: 14,
      color: COLOR.black,
      fontWeight: '600',
      textAlign: 'right',
      flex: 1,
    },
    boldValue: {
      fontWeight: '700',
      fontSize: 15,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: COLOR.black,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: '800',
      color: COLOR.primary,
    },
    transactionId: {
      color: COLOR.primary,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      backgroundColor: COLOR.lightGray + '50',
      marginVertical: 16,
    },
    successContainer: {
      alignItems: 'center',
      marginTop: 32,
      paddingVertical: 24,
    },
    successIconWrapper: {
      marginBottom: 16,
    },
    successIconBg: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: COLOR.success + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    successText: {
      fontSize: 20,
      fontWeight: '800',
      color: COLOR.black,
      marginBottom: 6,
    },
    successSubtext: {
      fontSize: 15,
      color: COLOR.gray,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    viewOrderButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLOR.white,
      borderRadius: 16,
      paddingVertical: 16,
      gap: 8,
      borderWidth: 2,
      borderColor: COLOR.primary,
    },
    viewOrderButtonText: {
      color: COLOR.primary,
      fontSize: 15,
      fontWeight: '700',
    },
    downloadButtonAlt: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLOR.primary,
      borderRadius: 16,
      paddingVertical: 16,
      gap: 8,
    },
    downloadButtonText: {
      color: COLOR.white,
      fontSize: 15,
      fontWeight: '700',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: COLOR.white,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: COLOR.lightGray + '30',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 8,
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLOR.primary,
      borderRadius: 16,
      paddingVertical: 16,
      gap: 8,
    },
    footerButtonText: {
      color: COLOR.white,
      fontSize: 16,
      fontWeight: '700',
    },
  });
}

import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  { id: "change_plans", label: "Change in Plans", label_vi: "Thay đổi kế hoạch" },
  { id: "unforeseen", label: "Unforeseen Events", label_vi: "Sự kiện không lường trước" },
  { id: "unexpected_work", label: "Unexpected Work", label_vi: "Công việc đột xuất" },
  { id: "personal_preferences", label: "Personal Preferences", label_vi: "Sở thích cá nhân" },
  { id: "booking_mistakes", label: "Booking Mistakes", label_vi: "Đặt nhầm" },
  { id: "other", label: "Other", label_vi: "Lý do khác" },
];

export default function CancelBooking() {
  const params = useLocalSearchParams<{ booking_id: string }>();
  const [selectedReason, setSelectedReason] = useState<string>("change_plans");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleCancelBooking = () => {
    console.log("Cancel button pressed"); // Debug log
    
    if (selectedReason === "other" && !otherReason.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập lý do hủy");
      return;
    }

    Alert.alert(
      "Xác nhận hủy đặt phòng",
      "Bạn có chắc chắn muốn hủy đặt phòng này không?",
      [
        {
          text: "Không",
          style: "cancel",
          onPress: () => console.log("Cancel pressed"),
        },
        {
          text: "Hủy đặt phòng",
          style: "destructive",
          onPress: () => {
            console.log("Confirm cancel pressed");
            setLoading(true);
            
            // Simulate API call
            setTimeout(() => {
              setLoading(false);
              console.log("Cancellation completed");
              
              // Show success alert
              Alert.alert(
                "Hủy thành công",
                "Đơn đặt phòng đã được hủy thành công",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("Navigating back to history");
                      // Navigate back to history with cancelled tab
                      router.push("/(tabs)/historyBooking");
                    },
                  },
                ]
              );
            }, 1500);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLOR.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancel Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        

        {/* Instruction */}
        <Text style={styles.instruction}>
          Please select the reason for cancellations:
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
                <Text style={styles.reasonLabel}>{reason.label}</Text>
                <Text style={styles.reasonLabelVi}>{reason.label_vi}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Reason Input */}
        {selectedReason === "other" && (
          <View style={styles.otherSection}>
            <Text style={styles.otherLabel}>Other</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your Reason"
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
            <Ionicons name="information-circle" size={20} color={COLOR.primary} />
            <Text style={styles.infoHeaderText}>Thông tin đặt phòng</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã đặt phòng:</Text>
            <Text style={styles.infoValue}>#{params.booking_id?.padStart(6, '0')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Đang đặt</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cancelButton, loading && styles.cancelButtonDisabled]}
          onPress={() => {
            console.log("Button touched!");
            handleCancelBooking();
          }}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <>
              <Ionicons name="hourglass-outline" size={20} color={COLOR.white} />
              <Text style={styles.cancelButtonText}>Đang xử lý...</Text>
            </>
          ) : (
            <>
              <Ionicons name="close-circle" size={20} color={COLOR.white} />
              <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
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
    paddingBottom: 100,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: COLOR.danger + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLOR.danger + '30',
  },
  warningIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR.danger + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLOR.danger,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: COLOR.darkGray,
    lineHeight: 18,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: '600',
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
    fontWeight: '600',
    color: COLOR.black,
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.lightGray + '50',
    shadowColor: '#000',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.lightGray + '30',
  },
  infoHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLOR.black,
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
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.black,
  },
  statusBadge: {
    backgroundColor: COLOR.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLOR.primary,
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
    zIndex: 999,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '700',
  },
});
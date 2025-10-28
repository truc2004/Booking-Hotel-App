import React from "react";
import { StyleSheet, ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ButtonBottom from "@/components/ButtonBottom";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBackScreen from "@/components/ButtonBackScreen";

export default function BookingScreen() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleBooking = () => {
        router.push("/(tabs)/home/paymentSuccess"); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <ButtonBackScreen />
                    <Text style={styles.title}>Thanh toán</Text>
                </View>

                {/* Property Card */}
                <View style={styles.propertyCard}>
                    <View style={styles.propertyImageContainer}>
                        <Image
                            source={require("../../../assets/images/hotel1/1.jpg")} 
                            style={styles.propertyImage}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.propertyInfo}>
                        <Text style={styles.propertyName}>Harbor Haven Hideaway</Text>
                        <Text style={styles.location}>123 Nguyễn Kiện, Gò Vấp</Text>
                        <Text style={styles.price}>1.000.000đ/đêm</Text>
                    </View>
                </View>

                {/* Booking Details */}
                <View style={styles.detailsSection}>
                    <View style={[styles.detailContainer, styles.detailBorder]}>
                        <Text style={styles.detailLabel}>Ngày đặt phòng</Text>
                        <Text style={styles.detailValue}>24 Th8, 2025 | 10:00 Sáng</Text>
                    </View>
                    <View style={[styles.detailContainer, styles.detailBorder]}>
                        <Text style={styles.detailLabel}>Nhận phòng</Text>
                        <Text style={styles.detailValue}>04 Th10, 2025</Text>
                    </View>
                    <View style={[styles.detailContainer, styles.detailBorder]}>
                        <Text style={styles.detailLabel}>Trả phòng</Text>
                        <Text style={styles.detailValue}>03 Th11, 2025</Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Text style={styles.detailLabel}>Khách</Text>
                        <Text style={styles.detailValue}>05 Người</Text>
                    </View>
                </View>

                {/* Amount Section */}
                <View style={styles.amountSection}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Số tiền</Text>
                        <Text style={styles.amountValue}>1.000.000đ/đêm</Text>
                    </View>
                    <View style={[styles.amountRow, styles.amountRowLast]}>
                        <Text style={styles.amountLabel}>Phụ thu</Text>
                        <Text style={styles.amountValue}>150.000đ/đêm</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>1.500.000đ/đêm</Text>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.paymentSection}>
                    <View style={styles.paymentRow}>
                        <View style={styles.paymentIconContainer}>
                          
                            <View style={styles.paymentIcon} />
                        </View>
                        <Text style={styles.paymentText}>Cash</Text>
                        <TouchableOpacity>
                            <Text style={styles.changeText}>Thay đổi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <ButtonBottom onPress={handleBooking} title={"Thanh toán"} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#f8f9fa" 
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
    },
    propertyCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 2, // For Android shadow
        shadowColor: "#000", // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    propertyImageContainer: {
        position: "relative",
    },
    propertyImage: {
        width: 120,
        height: 120,
    },
    discountBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "#FF5A5F",
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    discountText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    propertyInfo: {
        flex: 1,
        padding: 12,
        justifyContent: "space-between",
    },
    propertyName: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    location: {
        fontSize: 13,
        color: "#666",
        marginBottom: 8,
    },
    price: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
    },
    detailsSection: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        marginBottom: 16,
    },
    detailContainer: {
        paddingVertical: 12,
        alignItems: "flex-start",
    },
    detailBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 13,
        color: "#666",
    },
    amountSection: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        marginBottom: 16,
    },
    amountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    amountRowLast: {
        borderBottomWidth: 0,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        marginTop: 4,
    },
    amountLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
    },
    amountValue: {
        fontSize: 13,
        color: "#666",
        textAlign: "right",
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
    },
    totalValue: {
        fontSize: 13,
        fontWeight: "700",
        color: "#333",
        textAlign: "right",
    },
    paymentSection: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        marginBottom: 16,
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    paymentIconContainer: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    paymentIcon: {
        width: 24,
        height: 24,
        backgroundColor: "#003087", 
        borderRadius: 4,
    },
    paymentText: {
        flex: 1,
        fontSize: 13,
        fontWeight: "500",
        color: "#333",
    },
    changeText: {
        fontSize: 13,
        color: "#007AFF",
        fontWeight: "500",
    },
});
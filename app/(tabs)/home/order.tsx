import ButtonBottom from "@/components/ButtonBottom";
import HeaderScreen from "@/components/HeaderScreen";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingScreen() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        gender: "Nam",
        phone: "",
        citizenId: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        citizenId: "",
    });

     const handleInputChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
       
        setErrors({ ...errors, [key]: "" });  // Xóa lỗi của ô đó khi người dùng nhập lại
    };

     const handleBooking = () => {
        let newErrors: any = {};

        if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
        if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
        if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        if (!form.citizenId.trim())
            newErrors.citizenId = "Vui lòng nhập số CCCD/CMND";

        setErrors(newErrors);

        // Nếu có lỗi thì dừng lại
        if (Object.keys(newErrors).length > 0) return;

        // Nếu không có lỗi -> điều hướng
        router.push("/(tabs)/home/paymentSuccess");
    };

    const handleChangePayment = () => {
        router.push({
            pathname: '/(tabs)/home/paymentMethod'
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderScreen title="Thanh toán" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* === Thông tin phòng === */}
                <View style={styles.card}>
                    <Image
                        source={require("../../../assets/images/hotel1/1.jpg")}
                        style={styles.image}
                    />
                    <View style={styles.cardInfo}>
                        <Text style={styles.hotelName}>Harbor Haven Hideaway</Text>
                        <Text style={styles.hotelLocation}>123 Nguyễn Kiện, Gò Vấp</Text>
                        <Text style={styles.hotelPrice}>1.000.000đ / đêm</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quy định phòng</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Số lượng người tối đa</Text>
                        <Text style={styles.value}>6</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Phụ thu người lớn</Text>
                        <Text style={styles.value}>1.000.000đ / đêm</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Phụ thu trẻ em</Text>
                        <Text style={styles.value}>1.000.000đ / đêm</Text>
                    </View>
                </View>

                {/* === Chi tiết đặt phòng === */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chi tiết đặt phòng</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Ngày đặt</Text>
                        <Text style={styles.value}>24 Th8, 2025 | 10:00</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nhận phòng</Text>
                        <Text style={styles.value}>04 Th10, 2025</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Trả phòng</Text>
                        <Text style={styles.value}>03 Th11, 2025</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Số khách</Text>
                        <Text style={styles.value}>5 người</Text>
                    </View>
                </View>

                {/* === Thông tin người đặt === */}
                 <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin người đặt</Text>

                    {/* Họ và tên */}
                    <Text style={styles.inputLabel}>Họ và tên</Text>
                    {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập họ và tên"
                        value={form.name}
                        onChangeText={(t) => handleInputChange("name", t)}
                    />

                    {/* Email */}
                    <Text style={styles.inputLabel}>Email</Text>
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email"
                        keyboardType="email-address"
                        value={form.email}
                        onChangeText={(t) => handleInputChange("email", t)}
                    />

                    {/* Số điện thoại */}
                    <Text style={styles.inputLabel}>Số điện thoại</Text>
                    {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số điện thoại"
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(t) => handleInputChange("phone", t)}
                    />

                    {/* Giới tính */}
                    <Text style={styles.inputLabel}>Giới tính</Text>
                    <View style={styles.genderContainer}>
                        {["Nam", "Nữ"].map((g) => (
                            <TouchableOpacity
                                key={g}
                                style={[
                                    styles.genderButton,
                                    form.gender === g && styles.genderButtonActive,
                                ]}
                                onPress={() => handleInputChange("gender", g)}
                            >
                                <Text
                                    style={[
                                        styles.genderText,
                                        form.gender === g && styles.genderTextActive,
                                    ]}
                                >
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* CCCD */}
                    <Text style={styles.inputLabel}>Số CCCD/CMND</Text>
                    {errors.citizenId ? <Text style={styles.errorText}>{errors.citizenId}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số CCCD/CMND"
                        keyboardType="numeric"
                        value={form.citizenId}
                        onChangeText={(t) => handleInputChange("citizenId", t)}
                    />
                </View>
                
                {/* === Phương thức thanh toán === */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                    <View style={styles.paymentRow}>
                        <View style={styles.paymentIcon} />
                        <Text style={styles.paymentText}>Tiền mặt (Cash)</Text>
                        <TouchableOpacity>
                            <Text style={styles.changeText} onPress={handleChangePayment}>Thay đổi</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* === Tổng tiền === */}
                <View style={styles.amountCard}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Giá phòng</Text>
                        <Text style={styles.amountValue}>1.000.000đ</Text>
                    </View>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Phụ thu</Text>
                        <Text style={styles.amountValue}>150.000đ</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>1.150.000đ</Text>
                    </View>
                </View>

                
            </ScrollView>

            <ButtonBottom title="Xác nhận & Thanh toán" onPress={handleBooking} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F2F4F8" },
    scrollContent: { paddingBottom: 100 },

    // === Thông tin phòng ===
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    image: { width: 120, height: 120 },
    cardInfo: { flex: 1, padding: 14, justifyContent: "space-between" },
    hotelName: { fontSize: 15, fontWeight: "700", color: "#222" },
    hotelLocation: { fontSize: 13, color: "#777", marginVertical: 4 },
    hotelPrice: { fontSize: 14, fontWeight: "600", color: "#007AFF" },

    // === Section chung ===
    section: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        marginBottom: 18,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#222",
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    label: { fontSize: 13, fontWeight: "500", color: "#333" },
    value: { fontSize: 13, color: "#666" },

    // === Input có label ===
    inputLabel: {
        fontSize: 13,
        fontWeight: "500",
        color: "#333",
        marginBottom: 6,
        marginTop: 4,
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 13,
        backgroundColor: "#FAFAFA",
        marginBottom: 10,
    },

    // === Giới tính ===
    genderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        marginHorizontal: 4,
        backgroundColor: "#FAFAFA",
    },
    genderButtonActive: {
        backgroundColor: "#E8F0FF",
        borderColor: "#007AFF",
    },
    genderText: { fontSize: 13, color: "#555" },
    genderTextActive: { color: "#007AFF", fontWeight: "600" },

    // === Tổng tiền ===
    amountCard: {
        marginHorizontal: 20,
        backgroundColor: "#007AFF10",
        borderRadius: 16,
        padding: 16,
        marginBottom: 18,
    },
    amountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        marginTop: 4,
    },
    amountLabel: { fontSize: 13, color: "#333" },
    amountValue: { fontSize: 13, color: "#444", fontWeight: "500" },
    totalLabel: { fontSize: 14, fontWeight: "700", color: "#000" },
    totalValue: { fontSize: 14, fontWeight: "700", color: "#007AFF" },

    // === Thanh toán ===
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    paymentIcon: {
        width: 24,
        height: 24,
        backgroundColor: "#007AFF",
        borderRadius: 6,
        marginRight: 10,
    },
    paymentText: { flex: 1, fontSize: 13, color: "#333" },
    changeText: { fontSize: 13, color: "#007AFF", fontWeight: "500" },

    // hiển thị lỗi
     errorText: {
        color: "#FF3B30",
        fontSize: 13,
        marginTop: 6,
        fontWeight: "500",
    },



});

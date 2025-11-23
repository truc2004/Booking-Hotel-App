import { fetchHotelById } from "@/api/hotelApi";
import { fetchRoomById } from "@/api/roomApi";
import ButtonBottom from "@/components/ButtonBottom";
import HeaderScreen from "@/components/HeaderScreen";
import { Hotel } from "@/types/hotel";
import { Room } from "@/types/room";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/auth/auth-store";
import { accountApi } from "@/api/accountApi";
import type { Account } from "@/types/account";

export default function BookingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        room_id: string;
        hotel_id: string;
        check_in: string;
        check_out: string;
        adults: string;
        children: string;
        note: string;
    }>();
    const { room_id, hotel_id, check_in, check_out, adults, children, note } =
        params;

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hotel, setHotel] = useState<Hotel | null>(null);

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
    const { user } = useAuth();
    const [account, setAccount] = useState<Account | null>(null);
    const [loadingAccount, setLoadingAccount] = useState(true);

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

        const loadHotel = async () => {
            try {
                const data: Hotel = await fetchHotelById(hotel_id);
                setHotel(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Lỗi tải thông tin khách sạn");
            } finally {
                setLoading(false);
            }
        };

        loadHotel();
        loadRoom();
    }, [room_id, hotel_id]);

    useEffect(() => {
        const loadAccount = async () => {
            try {
                if (!user?.email) {
                    setLoadingAccount(false);
                    return;
                }

                // tìm trong DB bằng email Firebase
                const acc = await accountApi.findByEmail(user.email);
                setAccount(acc);

                // Tự động fill thông tin người đặt
                setForm((prev) => ({
                    ...prev,
                    name: acc.user_name || "",
                    phone: acc.phone || "",
                    email: acc.email || "",
                }));

            } catch (e) {
                console.log("Error load account:", e);
            } finally {
                setLoadingAccount(false);
            }
        };

        loadAccount();
    }, [user?.email]);


    const handleInputChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
        setErrors({ ...errors, [key]: "" });
    };

    const today = new Date();

    const formatDate = (rawDate: any) => {
        const date = new Date(rawDate);
        return (
            date.getDate().toString().padStart(2, "0") +
            " th" +
            (date.getMonth() + 1).toString().padStart(2, "0") +
            ", " +
            date.getFullYear()
        );
    };

    const formattedToday = formatDate(today);
    const formattedCheckIn = formatDate(check_in);
    const formattedCheckOut = formatDate(check_out);
    const totalGuests =
        (adults ? parseInt(adults) : 0) + (children ? parseInt(children) : 0);

    // Số đêm
    const getTotalNights = (checkIn: string, checkOut: string) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const totalNights = getTotalNights(check_in, check_out);

    // Tính tổng tiền TRẢ VỀ CẢ extraFee để dùng hiển thị và truyền đi
    const calcPrice = () => {
        if (!room) return { extraFee: 0, totalAmount: 0 };

        let extraFee = 0;
        const nights = totalNights;

        if (totalGuests > (room.bed_count ?? 0) * 2) {
            extraFee = room.extra_fee_adult ?? 0;
        }

        const totalAmount = (room.price_per_night ?? 0) * nights + extraFee;
        return { extraFee, totalAmount };
    };

    const { extraFee, totalAmount } = calcPrice();



    const handleBooking = () => {
        let newErrors: any = {};

        //  check đnagư nhập
        if (!user?.email) {
            Alert.alert(
                "Yêu cầu đăng nhập",
                "Vui lòng đăng nhập trước khi thanh toán.",
                [
                    {
                        text: "Hủy",
                        style: "cancel",
                    },
                    {
                        text: "Đăng nhập",
                        onPress: () => {
                            // Đường dẫn màn đăng nhập của em
                            router.push("/(auth)/sign-in");
                        },
                    },
                ]
            );
            return; // Dừng, không cho thanh toán tiếp
        }

        // === Validate tên ===
        if (!form.name.trim()) {
            newErrors.name = "Họ và tên không được để trống";
        }

        // === Validate email ===
        if (!form.email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!form.email.endsWith("@gmail.com")) {
            newErrors.email = "Email phải kết thúc bằng @gmail.com";
        }

        // === Validate số điện thoại ===
        if (!form.phone.trim()) {
            newErrors.phone = "Số điện thoại không được để trống";
        } else if (!/^\d{10}$/.test(form.phone)) {
            newErrors.phone = "Số điện thoại phải gồm 10 chữ số";
        }

        // === Validate CCCD ===
        if (!form.citizenId.trim()) {
            newErrors.citizenId = "CCCD/CMND không được để trống";
        } else if (!/^\d{12}$/.test(form.citizenId)) {
            newErrors.citizenId = "CCCD phải gồm 12 chữ số";
        }

        setErrors(newErrors);

        // Nếu có lỗi -> không cho qua màn thanh toán
        if (Object.keys(newErrors).length > 0) return;

        // ====== BUNDLE BOOKING DATA ======
        const bookingData = {
            account_id: account?.account_id || null,
            room_id,
            check_in_date: check_in,   // string ISO từ màn trước
            check_out_date: check_out,
            user_booking_info: {
                full_name: form.name,
                phone: form.phone,
                email: form.email,
            },
            hotel_info: {
                name: hotel?.name ?? "",
                address: `${hotel?.addresses?.detailAddress ?? ""}, ${hotel?.addresses?.district ?? ""}`,
            },
            num_adults: adults ? parseInt(adults) : 0,
            num_children: children ? parseInt(children) : 0,
            extra_fee: extraFee,
            room_price: room?.price_per_night ?? 0,
            total_price: totalAmount,
            note: note || "",
            status: "upcoming",
        };

        router.push({
            pathname: "/(tabs)/home/paymentCodeQR",
            params: {
                totalAmount: totalAmount.toString(),
                bookingData: JSON.stringify(bookingData),
            },
        });
    };


    if (loading || loadingAccount)
        return (
            <View
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
                <ActivityIndicator size="large" color="#2E76FF" />
            </View>
        );

    return (
        <SafeAreaView style={styles.container}>
            <HeaderScreen title="Thanh toán" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Thông tin phòng */}
                <View style={styles.card}>
                    <Image
                        source={require("../../../assets/images/hotel1/1.jpg")}
                        style={[styles.image, { height: "100%" }]}
                    />
                    <View style={styles.cardInfo}>
                        <Text style={styles.hotelName}>{hotel?.name}</Text>
                        <Text style={styles.hotelLocation}>
                            {hotel?.addresses?.detailAddress},{" "}
                            {hotel?.addresses?.district}
                        </Text>
                        <Text style={styles.hotelPrice}>
                            {room?.price_per_night?.toLocaleString()}₫ /đêm
                        </Text>
                    </View>
                </View>

                {/* Chi tiết đặt phòng */}
                <View className="section" style={styles.section}>
                    <Text style={styles.sectionTitle}>Chi tiết đặt phòng</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Ngày đặt</Text>
                        <Text style={styles.value}>{formattedToday}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nhận phòng</Text>
                        <Text style={styles.value}>
                            {formattedCheckIn} | {hotel?.check_in_time}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Trả phòng</Text>
                        <Text style={styles.value}>
                            {formattedCheckOut} | {hotel?.check_out_time}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Số khách</Text>
                        <Text style={styles.value}>{totalGuests}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Ghi chú</Text>
                        <Text style={styles.value}>{note}</Text>
                    </View>
                </View>

                {/* Thông tin người đặt */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin người đặt</Text>

                    {/* Họ và tên */}
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>Họ và tên</Text>
                        <Text style={styles.requiredMark}>*</Text>
                    </View>
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập họ và tên"
                        value={form.name}
                        onChangeText={(t) => handleInputChange("name", t)}
                    />

                    {/* Email */}
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <Text style={styles.requiredMark}>*</Text>
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email"
                        keyboardType="email-address"
                        value={form.email}
                        onChangeText={(t) => handleInputChange("email", t)}
                    />

                    {/* Số điện thoại */}
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>Số điện thoại</Text>
                        <Text style={styles.requiredMark}>*</Text>
                    </View>
                    {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
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
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>Số CCCD/CMND</Text>
                        <Text style={styles.requiredMark}>*</Text>
                    </View>
                    {errors.citizenId && (
                        <Text style={styles.errorText}>{errors.citizenId}</Text>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số CCCD/CMND"
                        keyboardType="numeric"
                        value={form.citizenId}
                        onChangeText={(t) => handleInputChange("citizenId", t)}
                    />
                </View>

                {/* Phương thức thanh toán */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                    <View style={styles.paymentRow}>
                        <View style={styles.paymentIcon} />
                        <Text style={styles.paymentText}>Thanh toán ngân hàng</Text>
                    </View>
                </View>

                {/* Tổng tiền */}
                <View style={styles.amountCard}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Giá phòng</Text>
                        <Text style={styles.amountValue}>
                            {room?.price_per_night.toLocaleString()}đ
                        </Text>
                    </View>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Thời gian</Text>
                        <Text style={styles.amountValue}>{totalNights} đêm</Text>
                    </View>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Phụ thu</Text>
                        <Text style={styles.amountValue}>
                            {extraFee.toLocaleString()}đ
                        </Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>
                            {totalAmount.toLocaleString()}đ
                        </Text>
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
        alignItems: "flex-start",
    },
    image: { width: 120, height: 120 },
    cardInfo: { flex: 1, padding: 14, justifyContent: "space-between" },
    hotelName: { fontSize: 15, fontWeight: "700", color: "#222" },
    hotelLocation: { fontSize: 13, color: "#777", marginVertical: 4 },
    hotelPrice: { fontSize: 14, fontWeight: "600", color: "#007AFF" },
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
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 16,
    },
    requiredMark: {
        color: "red",
        fontSize: 16,
        fontWeight: "700",
    },
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
    errorText: {
        color: "#FF3B30",
        fontSize: 13,
        marginTop: 6,
        fontWeight: "500",
    },
});

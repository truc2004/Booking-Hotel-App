import { fetchRoomById } from "@/api/roomApi";
import { Room } from "@/types/room";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Platform,
    Dimensions,
    KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { LinearGradient } from 'expo-linear-gradient'; 
import ButtonBackScreen from "@/components/ButtonBackScreen";

const BUTTON_HEIGHT = 120; // Giữ nguyên để đảm bảo khoảng trống

export default function BookingScreen() {
    const { room_id, hotel_id } = useLocalSearchParams<{ room_id: string; hotel_id: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // States cho ngày
    const today = new Date(); // lấy ngày hiện tại
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [checkInDate, setCheckInDate] = useState<Date>(today);
    const [checkOutDate, setCheckOutDate] = useState<Date>(tomorrow);
    const [showCheckInPicker, setShowCheckInPicker] = useState(false); // ẩn và hiện lịch
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

    // States cho số lượng người
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    // State cho note
    const [note, setNote] = useState("");

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

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;
    if (!room) return <Text>Không tìm thấy phòng</Text>;

    const onCheckInChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || checkInDate;
        setShowCheckInPicker(Platform.OS === "ios");
        setCheckInDate(currentDate);
        // Đảm bảo check out không trước check in
        if (currentDate >= checkOutDate) {
            const newOut = new Date(currentDate);
            newOut.setDate(newOut.getDate() + 1);
            setCheckOutDate(newOut);
        }
    };

    const onCheckOutChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || checkOutDate;
        setShowCheckOutPicker(Platform.OS === "ios");
        setCheckOutDate(currentDate);
    };

    const incrementAdults = () => setAdults(adults + 1);
    const decrementAdults = () => setAdults(adults > 1 ? adults - 1 : 1);
    const incrementChildren = () => setChildren(children + 1);
    const decrementChildren = () => setChildren(children > 0 ? children - 1 : 0);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
    <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top']}>
            <KeyboardAvoidingView 
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? BUTTON_HEIGHT : 0} // Sửa offset: BUTTON_HEIGHT cho iOS để tính đến bottom bar, 0 cho Android
            >
                <ScrollView 
                    style={styles.scrollContainer} 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: BUTTON_HEIGHT }}
                    contentInsetAdjustmentBehavior="automatic"
                    keyboardShouldPersistTaps="handled"
                    scrollIndicatorInsets={{ right: 1 }}
                >
                    {/* Phần hình ảnh với nút quay lại */}
                    <View style={styles.imageContainer}>
                        <ButtonBackScreen />

                        <Image
                            source={require("../../../assets/images/hotel1/1.jpg")} 
                            style={styles.roomImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Thông tin phòng */}
                    <View style={styles.infoContainer}>
                        <View style={styles.discountRating}>
                            <Text style={styles.discount}>10% Off</Text>
                            <View style={styles.rating}>
                                <Image source={require("../../../assets/images/icon/star.png")} style={styles.star}/>
                                <Text style={styles.ratingText}>4.5 (34 reviews)</Text>
                            </View>
                        </View>
                        <Text style={styles.roomName}>HarborHaven Hideaway</Text>
                        <Text style={styles.roomAddress}>123 Hoa Sứ, Phú Nhuận</Text>
                        <Text style={styles.price}>Giá: {room.price_per_night?.toLocaleString()}₫ /đêm</Text>
                    </View>

                    {/* Khung chung cho Check In, Check Out, Số lượng người, Note to Owner */}
                    <View style={styles.formContainer}>
                        {/* Check In */}
                        <View style={styles.dateSection}>
                            <Text style={styles.sectionTitle}>Check In</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={() => setShowCheckInPicker(true)}>
                                <Text style={styles.dateText}>{formatDate(checkInDate)}</Text>
                                <Image source={require("../../../assets/images/icon/calendar.png")} style={styles.calendarIcon}/>
                            </TouchableOpacity>
                            {showCheckInPicker && (
                                <DateTimePicker
                                    value={checkInDate}
                                    mode="date"
                                    display="default"
                                    minimumDate={today}
                                    onChange={onCheckInChange}
                                />
                            )}
                        </View>

                        {/* Check Out */}
                        <View style={styles.dateSection}>
                            <Text style={styles.sectionTitle}>Check Out</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={() => setShowCheckOutPicker(true)}>
                                <Text style={styles.dateText}>{formatDate(checkOutDate)}</Text>
                                <Image source={require("../../../assets/images/icon/calendar.png")} style={styles.calendarIcon}/>
                            </TouchableOpacity>
                            {showCheckOutPicker && (
                                <DateTimePicker
                                    value={checkOutDate}
                                    mode="date"
                                    display="default"
                                    minimumDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)}
                                    onChange={onCheckOutChange}
                                />
                            )}
                        </View>

                        {/* Số lượng người */}
                        <View style={styles.guestsSection}>
                            <Text style={styles.sectionTitle}>Số lượng người</Text>
                            <View style={styles.guestRow}>
                                <Text style={styles.guestLabel}>Người lớn</Text>
                                <View style={styles.counter}>
                                    <TouchableOpacity style={styles.counterButton} onPress={decrementAdults}>
                                        <Text style={styles.counterText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.counterValue}>{adults}</Text>
                                    <TouchableOpacity style={styles.counterButton} onPress={incrementAdults}>
                                        <Text style={styles.counterText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{borderBottomWidth: 1, borderBottomColor: "#e9ecef", marginVertical: 10}}></View>
                            <View style={styles.guestRow}>
                                <Text style={styles.guestLabel}>Trẻ em</Text>
                                <View style={styles.counter}>
                                    <TouchableOpacity style={styles.counterButton} onPress={decrementChildren}>
                                        <Text style={styles.counterText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.counterValue}>{children}</Text>
                                    <TouchableOpacity style={styles.counterButton} onPress={incrementChildren}>
                                        <Text style={styles.counterText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Note to owner */}
                        <View style={styles.noteSection}>
                            <Text style={styles.sectionTitle}>Ghi chú với khách sạn</Text>
                            <TextInput
                                style={styles.noteInput}
                                multiline
                                numberOfLines={4}
                                value={note}
                                onChangeText={setNote}
                                placeholder="Nhập ghi chú..."
                                textAlignVertical="top"
                                blurOnSubmit={false} // Để giữ focus khi submit
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Nút Continue cố định ở dưới */}
                <View style={styles.fixedButtonContainer}>
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.1)', 'transparent']} 
                        style={styles.shadowTop}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    />
                    <TouchableOpacity style={styles.continueButton} onPress={() => { /* Xử lý tiếp tục */ }}>
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    /* ===== CONTAINER & LAYOUT CHÍNH ===== */
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa", // Đổi nền nhạt hơn cho hiện đại
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },

    /* ===== PHẦN HÌNH ẢNH VÀ NÚT QUAY LẠI ===== */
    imageContainer: {
        position: "relative",
        height: 250,
    },
    backButton: {
        position: "absolute",
        top: 15,
        left: 15,
        zIndex: 1,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 25,
        paddingHorizontal: 12,
        paddingVertical: 8,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    roomImage: {
        width: "100%",
        height: "100%",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    /* ===== THÔNG TIN PHÒNG (Discount, Rating, Name, Address, Price) ===== */
    infoContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginTop: -10,
        borderRadius: 20,
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
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
        fontSize: 12,
        fontWeight: "600",
    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF3CD",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    star: {
        width: 15,
        height: 15,
        marginRight: 4,
    },
    ratingText: {
        fontSize: 12,
        color: "#856404",
        fontWeight: "500",
    },
    roomName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 6,
        lineHeight: 28,
    },
    roomAddress: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 12,
        lineHeight: 20,
    },
    price: {
        fontSize: 15,
        fontWeight: "700",
        color: "#27ae60",
    },

    /* ===== KHUNG CHUNG CHO CHECK IN/OUT, SỐ LƯỢNG NGƯỜI, NOTE ===== */
    formContainer: {
        marginHorizontal: 15,
        marginTop: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
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

    /* ===== PHẦN CHECK IN/OUT (Date Sections) ===== */
    dateSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 15,
    },
    dateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f8f9fa",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    dateText: {
        fontSize: 13,
        color: "#495057",
        flex: 1,
        fontWeight: "500",
    },
    calendarIcon: {
        color: "#007AFF",
        marginLeft: 10,
        height: 25,
        width: 25,
    },

    /* ===== PHẦN SỐ LƯỢNG NGƯỜI (Guests Section) ===== */
    guestsSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    guestRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",   
    },
    guestLabel: {
        fontSize: 14,
        color: "#2c3e50",
    },
    counter: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 25,
    },
    counterButton: {
        backgroundColor: "#fff",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    counterText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#495057",
    },
    counterValue: {
        marginHorizontal: 12,
        fontSize: 14,
        fontWeight: "600",
        minWidth: 20,
        textAlign: "center",
        color: "#2c3e50",
    },

    /* ===== PHẦN NOTE TO OWNER ===== */
    noteSection: {
        padding: 20,
    },
    noteInput: {
        borderWidth: 1,
        borderColor: "#e9ecef",
        padding: 16,
        borderRadius: 12,
        fontSize: 14,
        textAlignVertical: "top",
        backgroundColor: "#f8f9fa",
        minHeight: 100,
    },

    /* ===== PHẦN NÚT CONTINUE CỐ ĐỊNH (Fixed Bottom Bar) ===== */
    fixedButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: "#fff",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    shadowTop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 8,
    },
    continueButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#007AFF",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    continueButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
    },
});
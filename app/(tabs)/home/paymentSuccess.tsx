import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from "react-native";
import ButtonBottom from "@/components/ButtonBottom";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function PaymentScreen() {

    const handleUpdate = () => {
        router.push({
            pathname: "/(tabs)/home",
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.infoContainer}>
                <Image
                    source={require("../../../assets/images/icon/checklist.png")}
                    style={styles.icon}
                    resizeMode="contain"
                />
                <Text style={styles.successText}>Thanh toán thành công!</Text>
                <Text style={styles.messageText}>
                    Cảm ơn bạn đã đặt hàng. Chúc bạn có một trải nghiệm tuyệt vời!
                </Text>
            </View>

            {/* Nút Continue cố định dưới màn hình */}
            <ButtonBottom onPress={handleUpdate} title="Xác nhận" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFF",
        justifyContent: "space-between",
    },
    infoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    icon: {
        width: width * 0.3,
        height: width * 0.3,
        marginBottom: 30,
    },
    successText: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 12,
        textAlign: "center",
    },
    messageText: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        lineHeight: 22,
    },
});

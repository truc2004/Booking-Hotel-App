
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    Text,
} from "react-native";
import ButtonBottom from "@/components/ButtonBottom";
import { router } from "expo-router";
import HeaderScreen from "@/components/HeaderScreen";


export default function PasswordScreen() {

    const handleSubmit = () => {
        router.push({
            pathname: "/(tabs)/home/order",
        })
    }

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top']}>
            {/* header */}
            <HeaderScreen title="Mật khẩu" />

            <Text>Mật khẩu</Text>

            {/* Nút Continue cố định ở dưới */}
           <ButtonBottom onPress={handleSubmit} title={"Xác nhận"}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFF",
    },
});
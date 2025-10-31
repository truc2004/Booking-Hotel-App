
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    Text,
} from "react-native";
import ButtonBottom from "@/components/ButtonBottom";
import { router } from "expo-router";
import HeaderScreen from "@/components/HeaderScreen";


export default function SettingScreen() {

    const handleSubmit = () => {
        router.push({
            pathname: "/(tabs)/home/order",
        })
    }

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top']}>
            {/* header */}
            <HeaderScreen title="Cài đặt" />

            <Text>Cài đặt</Text>

            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFF",
    },
});
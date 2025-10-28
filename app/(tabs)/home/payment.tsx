
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
import { LinearGradient } from 'expo-linear-gradient';
import ButtonBottom from "@/components/ButtonBottom";
import { router } from "expo-router";


export default function PaymentScreen() {

    const handleUpdate = () => {
        router.push({
            pathname: "/(tabs)/home/order",
        })
    }

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top']}>


            {/* Nút Continue cố định ở dưới */}
           <ButtonBottom onPress={handleUpdate} title={"Xác nhận"}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
});
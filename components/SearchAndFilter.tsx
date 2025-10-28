import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity
} from "react-native";
import ButtonBottom from "@/components/ButtonBottom";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function SearchAndFilterScreen() {

    const handleFilter = () => {
        router.push("/home/filter");
    };

    return (
        <View style={styles.searchContainer}>
            <View style={styles.inputSearch}>
                <Image
                    source={require("../assets/images/icon/search.png")}
                    style={styles.iconSearch}
                />
                <TextInput
                    placeholder="Tìm kiếm địa điểm..."
                    placeholderTextColor="#777"
                    style={styles.searchInput}
                />
            </View>

            <TouchableOpacity style={styles.filter} onPress={handleFilter}>
                <Image
                    source={require("../assets/images/icon/fitler.png")}
                    style={styles.iconFilter}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 18,
        marginLeft: 5,
    },
    inputSearch: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F3F6",
        paddingHorizontal: 12,
        borderRadius: 14,
        flex: 1,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    iconSearch: {
        width: 22,
        height: 22,
        tintColor: "#2E76FF",
        marginRight: 8,
    },
    filter: {
        backgroundColor: "#2E76FF",
        borderRadius: 14,
        marginLeft: 12,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#2E76FF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    iconFilter: {
        width: 22,
        height: 22,
        tintColor: "#fff",
    },
});

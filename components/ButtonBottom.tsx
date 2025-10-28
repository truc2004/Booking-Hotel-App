import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    ViewStyle,
    TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonBottomProps {
    title: String;
    onPress: () => void;
}

const ButtonBottom: React.FC<ButtonBottomProps> = ({ onPress, title }) => {
    return (
        <View style={styles.fixedButtonContainer}>
            <LinearGradient
                colors={["rgba(0,0,0,0.1)", "transparent"]}
                style={styles.shadowTop}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            <TouchableOpacity style={styles.continueButton} onPress={onPress}>
                <Text style={styles.continueButtonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ButtonBottom;

interface Styles {
    fixedButtonContainer: ViewStyle;
    shadowTop: ViewStyle;
    continueButton: ViewStyle;
    continueButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
        backgroundColor: "#2E76FF",
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#2E76FF",
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

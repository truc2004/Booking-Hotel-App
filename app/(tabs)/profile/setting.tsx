import HeaderScreen from "@/components/HeaderScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  gray: "#CFCFCF",
  grayWhite: "#EFEFEF",
  white: "#FFFFFF",
};

const rows = [
  {
    key: "notification",
    label: "Cài đặt thông báo",
    icon: "notifications-outline",
    onPress: () => router.push("/(tabs)/profile/notification"),
  },
  {
    key: "password",
    label: "Quản lý mật khẩu",
    icon: "lock-closed-outline",
    onPress: () => router.push("/(tabs)/profile/password"),
  },
  {
    key: "delete",
    label: "Xóa tài khoản",
    icon: "trash-outline",
  },
];

export default function SettingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Cài đặt" />

      <View style={styles.list}>
        {rows.map((item, idx) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.row,
              idx !== rows.length - 1 ? styles.rowBorder : null,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.left}>
              <Ionicons name={item.icon as any} size={20} color={COLOR.blue} />
              <Text style={styles.text}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLOR.gray} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },
  list: { marginTop: 20, backgroundColor: COLOR.white },
  row: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E6E6",
  },
  left: { flexDirection: "row", gap: 10, alignItems: "center" },
  text: { fontSize: 15, color: COLOR.black },
});

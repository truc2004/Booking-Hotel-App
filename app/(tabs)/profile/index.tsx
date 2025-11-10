import HeaderScreen from "@/components/HeaderScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  gray: "#CFCFCF",
  grayWhite: "#EFEFEF",
  white: "#FFFFFF",
};

const MENU = [
  {
    key: "profile",
    label: "Hồ sơ của bạn",
    icon: "person-outline",
    onPress: () => router.push("/(tabs)/profile/edit"),
  },
  {
    key: "payment",
    label: "Phương thức thanh toán",
    icon: "card-outline",
    onPress: () => router.push("/(tabs)/profile/payment"),
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: "settings-outline",
    onPress: () => router.push("/(tabs)/profile/setting"),
  },
  {
    key: "help",
    label: "Trung tâm trợ giúp",
    icon: "help-circle-outline",
    onPress: () => router.push("/(tabs)/profile/helpCenter"),
  },
];

export default function ProfileScreen() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Hồ sơ" />


      <View style={styles.avatarWrap}>
        <Image
          source={{ uri: "https://i.pravatar.cc/160?img=12" }}
          style={styles.avatar}
        />
        <View style={styles.avatarEdit}>
          <Ionicons name="pencil" size={14} color={COLOR.white} />
        </View>
      </View>
      <Text style={styles.name}>Hồng Phúc</Text>

      <View style={styles.list}>
        {MENU.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.row}
            onPress={item.onPress}
          >
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon as any} size={20} color={COLOR.blue} />
              <Text style={styles.rowText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLOR.gray} />
          </TouchableOpacity>
        ))}

        {/* Đăng xuất */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowLogout(true)}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="log-out-outline" size={20} color={COLOR.blue} />
            <Text style={styles.rowText}>Đăng xuất</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLOR.gray} />
        </TouchableOpacity>
      </View>

      {showLogout && (
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Đăng xuất</Text>
            <Text style={styles.sheetDesc}>Bạn chắc chắn muốn đăng xuất?</Text>
            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[styles.sheetBtn, { backgroundColor: COLOR.grayWhite }]}
                onPress={() => setShowLogout(false)}
              >
                <Text style={{ color: COLOR.black, fontWeight: "600" }}>
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sheetBtn, { backgroundColor: COLOR.blue }]}
                onPress={() => setShowLogout(false)}
              >
                <Text style={{ color: COLOR.white, fontWeight: "600" }}>
                  Đồng ý
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  avatarWrap: {
    alignSelf: "center",
    marginTop: 20,
    position: "relative",
  },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarEdit: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLOR.blue,
    borderWidth: 2,
    borderColor: COLOR.white,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: COLOR.black,
  },
  list: { paddingHorizontal: 16, marginTop: 20, gap: 10 },
  row: {
    height: 50,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
    
  },
  rowLeft: { flexDirection: "row", gap: 10, alignItems: "center" },
  rowText: { fontSize: 15, color: COLOR.black },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLOR.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 10,
  },
  sheetTitle: { fontSize: 16, fontWeight: "600", color: COLOR.black },
  sheetDesc: { color: "#555" },
  sheetActions: { flexDirection: "row", gap: 10 },
  sheetBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

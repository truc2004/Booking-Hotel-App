import HeaderScreen from "@/components/HeaderScreen";
import { useAuth } from "@/src/auth/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
    key: "favorite",
    label: "Khách sạn yêu thích",
    icon: "help-circle-outline",
    onPress: () => router.push("/(tabs)/profile/favoriteRoom"),
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
  const { signOut, user } = useAuth();

  // Nếu chưa login -> đưa sang màn Sign In
  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/sign-in");
    }
  }, [user]);

  const handleConfirmLogout = async () => {
    setShowLogout(false);
    await signOut();
    // Sau signOut, user = null -> effect phía trên sẽ tự đưa về /(auth)/sign-in
  };

  // Trong lúc đang redirect (chưa có user) thì không render UI profile
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HeaderScreen title="Hồ sơ" />

      <View style={styles.avatarWrap}>
        <Image
          source={{ uri: "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.avatarEdit}>
          <Ionicons name="pencil" size={14} color={COLOR.white} />
        </View>
      </View>

      <Text style={styles.name}>{user.displayName ?? "Hồng Phúc"}</Text>
      {/* Hiển thị email của account đang đăng nhập */}
      <Text style={styles.email}>{user.email ?? "Không có email"}</Text>

      <View style={styles.list}>
        {MENU.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.row}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon as any} size={20} color={COLOR.blue} />
              <Text style={styles.rowText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLOR.gray} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowLogout(true)}
          activeOpacity={0.8}
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
          <Pressable
            style={styles.backdrop}
            onPress={() => setShowLogout(false)}
          />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Đăng xuất</Text>
            <Text style={styles.sheetDesc}>
              Bạn chắc chắn muốn đăng xuất?
            </Text>
            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[
                  styles.sheetBtn,
                  { backgroundColor: COLOR.grayWhite },
                ]}
                onPress={() => setShowLogout(false)}
                activeOpacity={0.8}
              >
                <Text style={{ color: COLOR.black, fontWeight: "600", fontSize: 13, }}>
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sheetBtn, { backgroundColor: COLOR.blue }]}
                onPress={handleConfirmLogout}
                activeOpacity={0.8}
              >
                <Text style={{ color: COLOR.white, fontWeight: "600", fontSize: 13, }}>
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
  avatarWrap: { alignSelf: "center", marginTop: 20, position: "relative" },
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
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.black,
  },
  email: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 12,
    color: "#555",
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
  },
  rowLeft: { flexDirection: "row", gap: 10, alignItems: "center" },
  rowText: { fontSize: 12, color: COLOR.black },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sheet: {
    backgroundColor: COLOR.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 10,
  },
  sheetTitle: { fontSize: 15, fontWeight: "600", color: COLOR.black },
  sheetDesc: { color: "#555", fontSize: 13, },
  sheetActions: { flexDirection: "row", gap: 10 },
  sheetBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
  },
});

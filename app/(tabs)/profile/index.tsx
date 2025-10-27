import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  gray: "#CFCFCF",
  grayWhite: "#EFEFEF",
};

const MENU = [
  { key: "profile", label: "Your Profile", icon: "person-outline", onPress: () => router.push("/(tabs)/profile/edit") },
  { key: "bookings", label: "My Bookings", icon: "receipt-outline", onPress: () => router.push("/(tabs)/profile/myBookings") },
  { key: "payment", label: "Payment Methods", icon: "card-outline" },
  { key: "wallet", label: "My Wallet", icon: "wallet-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
  { key: "help", label: "Help Center", icon: "help-circle-outline" },
  { key: "logout", label: "Log out", icon: "log-out-outline" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: "https://i.pravatar.cc/160?img=12" }}
            style={styles.avatar}
          />
          <View style={styles.avatarEdit}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>Esther Howard</Text>
      </View>

      <FlatList
        data={MENU}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={item.onPress}>
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon as any} size={20} color="#2E76FF" />
              <Text style={styles.rowText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLOR.gray} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", marginTop: 20, marginBottom: 16 },
  avatarWrap: { position: "relative" },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarEdit: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2E76FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { marginTop: 8, fontSize: 16, fontWeight: "600", color: "#101010" },
  row: {
    height: 52,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowText: { fontSize: 15, color: "#101010" },
  sep: { height: 10 },
});

import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Thông tin cá nhân</Text>
      <Text style={styles.sub}>Đây là trang hồ sơ của bạn.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
  sub: { marginTop: 8, color: "gray" },
});

import { StyleSheet, Text, View } from "react-native";

export default function HistoryBookingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lich su dat don</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
  sub: { marginTop: 8, color: "gray" },
});

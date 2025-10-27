import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingCard({
  item,
  type,
}: {
  item: any;
  type: "upcoming" | "completed" | "cancelled";
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        {/* Ảnh phòng */}
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* Thông tin */}
        <View style={styles.info}>
          <View style={styles.rowBetween}>
            <Text style={styles.discount}>10% OFF</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" color="#FACC15" size={14} />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>

          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.price}>
            ${item.price} <Text style={styles.perNight}>/night</Text>
          </Text>

          {/* Nút hành động */}
          <View style={styles.btnRow}>
            {type === "upcoming" && (
              <>
                <TouchableOpacity style={[styles.btn, styles.cancel]}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.primary]}>
                  <Text style={styles.primaryText}>E-Receipt</Text>
                </TouchableOpacity>
              </>
            )}

            {type === "completed" && (
              <>
                <TouchableOpacity style={[styles.btn, styles.outline]}>
                  <Text style={styles.outlineText}>Re-Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.primary]}>
                  <Text style={styles.primaryText}>Add Review</Text>
                </TouchableOpacity>
              </>
            )}

            {type === "cancelled" && (
              <Text style={styles.cancelledText}>Cancelled booking</Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 130,
  },
  info: {
    padding: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discount: {
    color: "#2E76FF",
    fontWeight: "600",
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 13,
    color: "#101010",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#101010",
    marginTop: 4,
  },
  location: {
    color: "#CFCFCF",
    fontSize: 13,
  },
  price: {
    color: "#101010",
    fontWeight: "600",
    marginTop: 4,
  },
  perNight: {
    color: "#CFCFCF",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  primary: {
    backgroundColor: "#2E76FF",
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  cancel: {
    backgroundColor: "#EFEFEF",
  },
  cancelText: {
    color: "#101010",
    fontWeight: "600",
  },
  outline: {
    borderWidth: 1,
    borderColor: "#2E76FF",
    backgroundColor: "#FFFFFF",
  },
  outlineText: {
    color: "#2E76FF",
    fontWeight: "600",
  },
  cancelledText: {
    color: "#2E76FF",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
});

import ButtonBackScreen from "@/components/ButtonBackScreen";
import HeaderScreen from "@/components/HeaderScreen";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface OptionItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const OptionItem: React.FC<OptionItemProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.optionRow}>
    <View style={[styles.optionCircle, selected && styles.optionCircleActive]}>
      {selected && <View style={styles.optionDot} />}
    </View>
    <Text style={[styles.optionLabel, selected && styles.optionLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function FilterScreen() {
  const [reviewRating, setReviewRating] = useState("4.5+");
  const [facilities, setFacilities] = useState(["All"]);
  const [bedrooms, setBedrooms] = useState(["1+"]);
  const [minPrice, setMinPrice] = useState(100000);
  const [maxPrice, setMaxPrice] = useState(500000);

  const toggleFacility = (item: any) => {
    setFacilities((prev) =>
      prev.includes(item)
        ? prev.filter((f) => f !== item)
        : [...prev.filter((f) => f !== "All"), item]
    );
  };

  const toggleBedroom = (item: any) => {
    setBedrooms((prev) =>
      prev.includes(item)
        ? prev.filter((b) => b !== item)
        : [...prev, item]
    );
  };

  const handleReset = () => {
    setFacilities(["All"]);
    setBedrooms(["1+"]);
    setMinPrice(100000);
    setMaxPrice(500000);
    setReviewRating("4.5+");
  };

  const handleApply = () => {
    router.push({
      pathname: "/(tabs)/home/listRoom"
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <HeaderScreen title="Bộ lọc" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* PRICE RANGE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Khoảng giá</Text>

          <View style={styles.adjustBox}>
            {/* Min */}
            <View style={styles.adjustRow}>
              <Text style={styles.adjustLabel}>Min</Text>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setMinPrice((p) => Math.max(0, p - 100000))}
              >
                <Text style={styles.adjustBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.adjustValue}>{minPrice}₫</Text>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setMinPrice((p) => Math.min(p + 100000, maxPrice - 100000))}
              >
                <Text style={styles.adjustBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Max */}
            <View style={styles.adjustRow}>
              <Text style={styles.adjustLabel}>Max</Text>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setMaxPrice((p) => Math.max(minPrice + 100000, p - 100000))}
              >
                <Text style={styles.adjustBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.adjustValue}>{maxPrice}₫</Text>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setMaxPrice((p) => Math.min(5000000, p + 100000))}
              >
                <Text style={styles.adjustBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* REVIEW */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Đánh giá</Text>
          {["4.5 - 5.0", "4.0 - 4.5", "3.5 - 4.0", "2.5 - 3.5"].map((label) => (
            <OptionItem
              key={label}
              label={`⭐ ${label}`}
              selected={reviewRating === label}
              onPress={() => setReviewRating(label)}
            />
          ))}
        </View>

        {/* FACILITIES */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tiện nghi</Text>
          {["All", "Chỗ đỗ xe", "Phòng gym", "Nhà hàng", "Hồ bơi"].map((label) => (
            <OptionItem
              key={label}
              label={label}
              selected={facilities.includes(label)}
              onPress={() => toggleFacility(label)}
            />
          ))}
        </View>

        {/* BEDROOMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Số phòng ngủ</Text>
          {["1+", "2+", "3+", "4+", "5+"].map((label) => (
            <OptionItem
              key={label}
              label={label}
              selected={bedrooms.includes(label)}
              onPress={() => toggleBedroom(label)}
            />
          ))}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetText}>Đặt lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backIcon: {
    fontSize: 28,
    color: "#2E76FF",
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  optionCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  optionCircleActive: {
    borderColor: "#2E76FF",
    backgroundColor: "#2E76FF",
  },
  optionDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  optionLabel: {
    fontSize: 16,
    color: "#475569",
  },
  optionLabelActive: {
    color: "#2E76FF",
    fontWeight: "600",
  },
  adjustBox: {
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
  },
  adjustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  adjustLabel: {
    fontSize: 16,
    color: "#1E293B",
    width: 50,
  },
  adjustBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2E76FF",
    justifyContent: "center",
    alignItems: "center",
  },
  adjustBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  adjustValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    minWidth: 70,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  resetBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#2E76FF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginRight: 8,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: "#2E76FF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginLeft: 8,
  },
  resetText: {
    color: "#2E76FF",
    fontSize: 16,
    fontWeight: "600",
  },
  applyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

import HeaderScreen from "@/components/HeaderScreen";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  primary: "#2E76FF",
  bg: "#F8FAFF",
  text: "#111827",
  subText: "#6B7280",
  border: "#E2E8F0",
  cardBg: "#FFFFFF",
};

interface OptionItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const OptionItem: React.FC<OptionItemProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.optionRow} activeOpacity={0.8}>
    <View style={[styles.optionCircle, selected && styles.optionCircleActive]}>
      {selected && <View style={styles.optionDot} />}
    </View>
    <Text style={[styles.optionLabel, selected && styles.optionLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const SORT_OPTIONS = [
  { key: "all", label: "Tất cả" },
  { key: "popular", label: "Phổ biến" },
  { key: "nearby", label: "Gần tôi" },
  { key: "price_low", label: "Giá thấp → cao" },
  { key: "price_high", label: "Giá cao → thấp" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];

export default function SearchFilterScreen() {
  // SEARCH
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // FILTER STATES
  const [sortBy, setSortBy] = useState<SortKey>("all");
  const [reviewRating, setReviewRating] = useState("4.5 - 5.0");
  const [facilities, setFacilities] = useState<string[]>(["All"]);
  const [bedrooms, setBedrooms] = useState<string[]>(["1+"]);
  const [minPrice, setMinPrice] = useState(100000);
  const [maxPrice, setMaxPrice] = useState(500000);

  const handleSearch = (keyword?: string) => {
    const q = (keyword ?? query).trim();
    if (!q) return;

    // Lưu lịch sử (local state)
    setRecentSearches((prev) => {
      const list = [q, ...prev.filter((item) => item !== q)];
      return list.slice(0, 5);
    });

    // Điều hướng đến listRoom chỉ với từ khóa
    router.push({
      pathname: "/(tabs)/home/listRoom",
      params: { q },
    });
  };

  const toggleFacility = (item: string) => {
    setFacilities((prev) => {
      // Nếu chọn All -> clear hết và chỉ để All
      if (item === "All") return ["All"];

      const withoutAll = prev.filter((f) => f !== "All");

      if (withoutAll.includes(item)) {
        // bỏ chọn
        const next = withoutAll.filter((f) => f !== item);
        return next.length === 0 ? ["All"] : next;
      } else {
        // chọn thêm
        return [...withoutAll, item];
      }
    });
  };

  const toggleBedroom = (item: string) => {
    setBedrooms((prev) => {
      if (prev.includes(item)) {
        const next = prev.filter((b) => b !== item);
        return next.length === 0 ? ["1+"] : next;
      }
      return [...prev, item];
    });
  };

  const handleReset = () => {
    setSortBy("all");
    setFacilities(["All"]);
    setBedrooms(["1+"]);
    setMinPrice(100000);
    setMaxPrice(500000);
    setReviewRating("4.5 - 5.0");
    setQuery("");
  };

  const handleApply = () => {
    // Gửi cả search + filter sang listRoom (tuỳ bạn parse để dùng)
    router.push({
      pathname: "/(tabs)/home/listRoom",
      params: {
        q: query.trim(),
        sort: sortBy,
        minPrice: String(minPrice),
        maxPrice: String(maxPrice),
        rating: reviewRating,
        facilities: facilities.join(","), // "All,Chỗ đỗ xe,..."
        bedrooms: bedrooms.join(","),     // "1+,2+,3+"
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER DÙNG CHUNG */}
      <HeaderScreen title="Tìm kiếm & Bộ lọc" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Ô SEARCH */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tìm kiếm</Text>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              placeholder="Nhập địa điểm, tên khách sạn..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch()}
            />
            {query.trim().length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Recent Search */}
          {recentSearches.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
              <FlatList
                data={recentSearches}
                keyExtractor={(item) => item}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.recentRow}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => handleSearch(item)}
                    >
                      <Text style={styles.recentText}>{item}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setRecentSearches((prev) =>
                          prev.filter((r) => r !== item)
                        )
                      }
                    >
                      <Text style={styles.remove}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* SORT BY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sắp xếp</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortScroll}
          >
            {SORT_OPTIONS.map((opt) => {
              const active = sortBy === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.sortChip, active && styles.sortChipActive]}
                  onPress={() => setSortBy(opt.key)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      active && styles.sortChipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

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
              <Text style={styles.adjustValue}>
                {minPrice.toLocaleString("vi-VN")}₫
              </Text>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() =>
                  setMinPrice((p) =>
                    Math.min(p + 100000, maxPrice - 100000)
                  )
                }
              >
                <Text style={styles.adjustBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Max */}
            <View style={styles.adjustRow}>
              <Text style={styles.adjustLabel}>Max</Text>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() =>
                  setMaxPrice((p) => Math.max(minPrice + 100000, p - 100000))
                }
              >
                <Text style={styles.adjustBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.adjustValue}>
                {maxPrice.toLocaleString("vi-VN")}₫
              </Text>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() =>
                  setMaxPrice((p) => Math.min(5000000, p + 100000))
                }
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
          {["All", "Chỗ đỗ xe", "Phòng gym", "Nhà hàng", "Hồ bơi"].map(
            (label) => (
              <OptionItem
                key={label}
                label={label}
                selected={facilities.includes(label)}
                onPress={() => toggleFacility(label)}
              />
            )
          )}
        </View>

        {/* BEDROOMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Số phòng ngủ</Text>
          {["1", "2", "3", "4"].map((label) => (
            <OptionItem
              key={label}
              label={label}
              selected={bedrooms.includes(label)}
              onPress={() => toggleBedroom(label)}
            />
          ))}
        </View>
      </ScrollView>

      {/* FOOTER BUTTONS */}
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
  container: { flex: 1, backgroundColor: COLOR.bg },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  card: {
    backgroundColor: COLOR.cardBg,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  // Tiêu đề mục -> 13
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLOR.text,
    marginBottom: 12,
  },

  // SEARCH
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.border,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#F9FAFB",
  },
  // Nội dung còn lại -> 12
  input: {
    flex: 1,
    height: "100%",
    fontSize: 12,
    color: COLOR.text,
  },
  clearText: {
    fontSize: 12,
    color: "#9CA3AF",
    paddingHorizontal: 4,
  },
  // Tiêu đề nhỏ (Tìm kiếm gần đây) cũng là tiêu đề mục -> 13
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: "600",
    color: COLOR.text,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  recentText: { fontSize: 12, color: COLOR.subText },
  remove: { fontSize: 12, color: "#9CA3AF", paddingHorizontal: 8 },

  // OPTION RADIO
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
    borderColor: COLOR.primary,
    backgroundColor: COLOR.primary,
  },
  optionDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  optionLabel: {
    fontSize: 12,
    color: "#475569",
  },
  optionLabelActive: {
    color: COLOR.primary,
    fontWeight: "600",
  },

  // PRICE
  adjustBox: {
    marginTop: 4,
    paddingVertical: 4,
  },
  adjustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  adjustLabel: {
    fontSize: 12,
    color: COLOR.text,
    width: 50,
  },
  adjustBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLOR.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  adjustBtnText: {
    color: "#fff",
    fontSize: 18, // có thể giữ 18–20 cho dễ bấm, không nhất thiết 12
    fontWeight: "bold",
  },
  adjustValue: {
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.text,
    minWidth: 90,
    textAlign: "center",
  },

  // SORT CHIPS
  sortScroll: {
    flexDirection: "row",
    paddingTop: 4,
  },
  sortChip: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.border,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  sortChipActive: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  sortChipText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  sortChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // FOOTER
  footer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  resetBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLOR.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginRight: 8,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: COLOR.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginLeft: 8,
  },
  resetText: {
    color: COLOR.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  applyText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

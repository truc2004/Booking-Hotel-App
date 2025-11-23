import HeaderScreen from "@/components/HeaderScreen";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const TABS = ["Câu hỏi", "Liên hệ"];

const CATEGORIES = [
  { key: "all", label: "Tất cả" },
  { key: "services", label: "Dịch vụ" },
  { key: "general", label: "Chung" },
  { key: "account", label: "Tài khoản" },
  { key: "payment", label: "Thanh toán" },
];

const FAQS = [
  {
    q: "Làm sao để đặt lịch đặt phòng?",
    a: "Chọn phòng, chọn thời gian, xác nhận thanh toán.",
    cat: "services",
  },
  {
    q: "Tôi có thể hủy đặt phòng không?",
    a: "Có, nếu còn trong thời gian cho phép.",
    cat: "services",
  },
  {
    q: "Tôi nhận chi tiết đặt phòng ở đâu?",
    a: "Trong mục Đơn đặt của tôi và email.",
    cat: "general",
  },
  {
    q: "Làm sao kiểm tra đơn đã đặt?",
    a: "Vào Hồ sơ → Đơn đặt của tôi.",
    cat: "account",
  },
  {
    q: "Thanh toán như thế nào?",
    a: "Chọn thẻ, Paypal hoặc Apple Pay.",
    cat: "payment",
  },
  {
    q: "Có gọi thoại/video được không?",
    a: "Có, liên hệ bộ phận hỗ trợ.",
    cat: "general",
  },
];

const CONTACTS = [
  { icon: "headset-outline", label: "Chăm sóc khách hàng" },
  { icon: "logo-whatsapp", label: "WhatsApp", sub: "(480) 555-0103" },
  { icon: "globe-outline", label: "Website" },
  { icon: "logo-facebook", label: "Facebook" },
  { icon: "logo-twitter", label: "Twitter" },
  { icon: "logo-instagram", label: "Instagram" },
];

export default function HelpCenterScreen() {
  const [activeTab, setActiveTab] = useState<"Câu hỏi" | "Liên hệ">("Câu hỏi");
  const [activeCat, setActiveCat] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = FAQS.filter((item) => {
    const byCat = activeCat === "all" ? true : item.cat === activeCat;
    const bySearch = item.q.toLowerCase().includes(search.toLowerCase());
    return byCat && bySearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Trung tâm trợ giúp" />

      {/* search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLOR.blue} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => {
          const active = t === activeTab;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.tabItem, active && styles.tabItemActive]}
              onPress={() => setActiveTab(t as any)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === "Câu hỏi" ? (
        <>
          {/* filter categories */}
          <View style={styles.filterWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            >
              {CATEGORIES.map((c) => {
                const act = c.key === activeCat;
                return (
                  <TouchableOpacity
                    key={c.key}
                    onPress={() => setActiveCat(c.key)}
                    style={[styles.chip, act && styles.chipActive]}
                  >
                    <Text style={act ? styles.chipTextActive : styles.chipText}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* list faq */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 22,
            }}
          >
            {filteredFaqs.map((item) => {
              const isOpen = expanded === item.q;
              return (
                <TouchableOpacity
                  key={item.q}
                  style={styles.faqItem}
                  onPress={() =>
                    setExpanded((p) => (p === item.q ? null : item.q))
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqTitle}>{item.q}</Text>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={COLOR.blue}
                    />
                  </View>
                  {isOpen && <Text style={styles.faqDesc}>{item.a}</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      ) : (
        // Liên hệ
        <ScrollView
          style={{ flex: 1, marginTop: 16 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 22 }}
        >
          {CONTACTS.map((c) => (
            <View key={c.label} style={styles.contactItem}>
              <View style={styles.contactHeader}>
                <View style={styles.contactLeft}>
                  <Ionicons name={c.icon as any} size={22} color={COLOR.blue} />
                  <Text style={styles.contactText}>{c.label}</Text>
                </View>
                <Ionicons name="chevron-down" size={18} color={COLOR.blue} />
              </View>
              {c.sub ? <Text style={styles.contactSub}>{c.sub}</Text> : null}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },

  searchWrap: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: COLOR.grayWhite,
    height: 44,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E6E6",
    gap: 20,
  },
  tabItem: { paddingBottom: 10 },
  tabItemActive: { borderBottomWidth: 2.5, borderBottomColor: COLOR.blue },
  tabText: { color: "#707070", fontWeight: "500", fontSize: 12 },
  tabTextActive: { color: COLOR.black },

  filterWrapper: {
    height: 42,
    marginTop: 10,
    marginBottom: 4,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: "center",
  },

  chip: {
    height: 32,
    backgroundColor: COLOR.grayWhite,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  chipActive: { backgroundColor: COLOR.blue },
  chipText: { color: COLOR.black, fontSize: 12 },
  chipTextActive: { color: COLOR.white, fontWeight: "600", fontSize: 12 },

  faqItem: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EAEAEB",
    padding: 14,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // tiêu đề 13
  faqTitle: { fontSize: 13, fontWeight: "600", color: COLOR.black },
  // nội dung 12
  faqDesc: { marginTop: 6, color: "#555", fontSize: 12 },

  contactItem: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EAEAEB",
    padding: 14,
    marginBottom: 12,
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactLeft: { flexDirection: "row", gap: 12, alignItems: "center" },
  // tiêu đề 13
  contactText: { fontWeight: "600", color: COLOR.black, fontSize: 13 },
  // nội dung 12
  contactSub: {
    marginTop: 6,
    marginLeft: 34,
    color: "#555",
    fontSize: 12,
  },
});

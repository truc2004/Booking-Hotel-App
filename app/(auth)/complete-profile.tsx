import { useAuth } from "@/src/auth/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const COLOR = { blue: "#2E76FF", text: "#101010", sub: "#6B7280", border: "#E5E7EB" };

export default function CompleteProfile() {
  const { signOut } = useAuth();

  const [name, setName] = useState("");
  const [code, setCode] = useState("+84");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");

  const handleComplete = async () => {
    // TODO: nếu sau này có API lưu profile (name/phone/gender) thì gọi ở đây

    try {
      // Đăng xuất user vừa sign up (Firebase mặc định login luôn)
      await signOut();
    } catch (e) {
      // Có thể log lỗi, nhưng vẫn cho quay lại sign-in để tránh bị kẹt
      console.warn("signOut error in CompleteProfile:", e);
    }

    router.replace("/(auth)/sign-in");
  };

  const disabled = !name || !phone || !gender;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={s.wrap}>
        <Text style={s.h1}>Complete Your Profile</Text>
        <Text style={s.sub}>Don’t worry, only you can see your personal data</Text>

        <View style={s.avatar}>
          <Ionicons name="person" size={48} color="#9CA3AF" />
          <View style={s.badge}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </View>
        </View>

        <View style={{ gap: 14 }}>
          {/* Name */}
          <View style={s.input}>
            <TextInput
              style={s.text}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={COLOR.sub}
            />
          </View>

          {/* Phone + code */}
          <View style={s.input}>
            <TextInput
              style={[s.text, { flex: 0.4 }]}
              value={code}
              onChangeText={setCode}
              placeholder="+84"
              placeholderTextColor={COLOR.sub}
            />
            <TextInput
              style={s.text}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              keyboardType="phone-pad"
              placeholderTextColor={COLOR.sub}
            />
          </View>

          {/* Gender */}
          <View style={s.selectRow}>
            {(["male", "female", "other"] as const).map((g) => (
              <TouchableOpacity
                key={g}
                style={[s.sel, gender === g && s.selActive]}
                onPress={() => setGender(g)}
                activeOpacity={0.8}
              >
                <Text style={[s.selText, gender === g && { color: "#fff" }]}>
                  {g === "male" ? "Male" : g === "female" ? "Female" : "Other"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[s.primary, disabled && { opacity: 0.5 }]}
          onPress={handleComplete}
          activeOpacity={0.8}
          disabled={disabled}
        >
          <Text style={s.primaryText}>Complete Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    gap: 16,
    justifyContent: "center",
  },
  h1: {
    fontSize: 24,
    fontWeight: "700",
    color: COLOR.text,
    textAlign: "center",
  },
  sub: {
    color: COLOR.sub,
    textAlign: "center",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  badge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: COLOR.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: COLOR.text,
  },
  selectRow: {
    flexDirection: "row",
    gap: 10,
  },
  sel: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.border,
    alignItems: "center",
    justifyContent: "center",
  },
  selActive: {
    backgroundColor: COLOR.blue,
    borderColor: COLOR.blue,
  },
  selText: {
    color: COLOR.text,
    fontWeight: "600",
  },
  primary: {
    backgroundColor: COLOR.blue,
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

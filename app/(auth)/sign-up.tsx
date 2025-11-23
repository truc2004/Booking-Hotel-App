
import { accountApi } from "@/api/accountApi";
import { humanizeAuthError } from "@/src/auth/auth-errors";
import { useAuth } from "@/src/auth/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLOR = { blue: "#2E76FF", text: "#101010", sub: "#6B7280", border: "#E5E7EB" };

export default function SignUp() {
  const { signUp, signOut } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [agree] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const disabled = !name || !email || !pass || !agree;

  const onSignUp = async () => {
    try {
      setErr(null);

      await signUp(name.trim(), email.trim(), pass);

      // Gọi backend để tạo / lấy account theo email
      await accountApi.createOrGetAccount(email.trim(), name.trim());

      // Đăng xuất ra để guard không tự redirect sang home
      await signOut();

      // Chuyển về màn Đăng nhập
      router.replace("/(auth)/sign-in");
    } catch (e) {
      setErr(humanizeAuthError(e));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={s.wrap}>
        <Image
          source={require("../../assets/images/LogoBookingApp.png")}
          style={s.logo}
          accessibilityLabel="Logo ứng dụng BookingHotel"
        />
        <Text style={s.h1}>Tạo tài khoản</Text>
        <Text style={s.sub}>Vui lòng điền đầy đủ thông tin bên dưới</Text>

        <View style={s.input}>
          <Ionicons name="person-outline" size={20} color={COLOR.sub} />
          <TextInput
            style={s.text}
            placeholder="Họ và tên"
            placeholderTextColor={COLOR.sub}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={s.input}>
          <Ionicons name="mail-outline" size={20} color={COLOR.sub} />
          <TextInput
            style={s.text}
            placeholder="Email"
            placeholderTextColor={COLOR.sub}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={s.input}>
          <Ionicons name="lock-closed-outline" size={20} color={COLOR.sub} />
          <TextInput
            style={s.text}
            placeholder="Mật khẩu"
            placeholderTextColor={COLOR.sub}
            secureTextEntry={!show}
            value={pass}
            onChangeText={setPass}
          />
          <TouchableOpacity onPress={() => setShow((v) => !v)}>
            <Ionicons
              name={show ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLOR.sub}
            />
          </TouchableOpacity>
        </View>

        {err ? <Text style={s.err}>{err}</Text> : null}

        <TouchableOpacity
          style={[s.primary, disabled && { opacity: 0.5 }]}
          disabled={disabled}
          onPress={onSignUp}
          activeOpacity={0.8}
        >
          <Text style={s.primaryText}>Đăng ký</Text>
        </TouchableOpacity>

        <View style={s.footer}>
          <Text style={{ color: COLOR.sub }}>Đã có tài khoản? </Text>
          <Link href="/(auth)/sign-in">
            <Text style={[s.link, { fontWeight: "600" }]}>Đăng nhập</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 14, justifyContent: "center" },
  logo: {
    width: 88,
    height: 88,
    alignSelf: "center",
    marginBottom: 6,
    resizeMode: "contain",
  },
  h1: { fontSize: 24, fontWeight: "700", color: COLOR.text, textAlign: "center" },
  sub: { color: COLOR.sub, marginTop: 4, textAlign: "center" },
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
  text: { flex: 1, fontSize: 15, color: COLOR.text },
  link: { color: COLOR.blue, fontSize: 13 },
  err: { color: "#DC2626", marginTop: 6, textAlign: "center" },
  primary: {
    backgroundColor: COLOR.blue,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
});

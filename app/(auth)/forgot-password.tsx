import { humanizeAuthError } from "@/src/auth/auth-errors";
import { useAuth } from "@/src/auth/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLOR = {
  blue: "#2E76FF",
  sub: "#6B7280",
  border: "#E5E7EB",
  text: "#101010",
  ok: "#16A34A",
  err: "#DC2626",
};

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const disabled = !email || cooldown > 0;

  const normalize = (s: string) => s.trim();

  const startCooldown = (sec = 30) => {
    setCooldown(sec);
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const onSend = async () => {
    try {
      setErr(null);
      setOk(null);
      const e = normalize(email);
      await resetPassword(e);
      setOk(
        "Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (kể cả Spam/Thư rác)."
      );
      startCooldown(30);
    } catch (e) {
      setErr(humanizeAuthError(e));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={s.wrap}>
        <Text style={s.h1}>Quên mật khẩu</Text>
        <Text style={s.sub}>
          Nhập email đã dùng để đăng ký tài khoản. Chúng tôi sẽ gửi liên kết để
          bạn đặt lại mật khẩu.
        </Text>

        <View style={s.input}>
          <Ionicons name="mail-outline" size={20} color={COLOR.sub} />
          <TextInput
            style={s.text}
            placeholder="Nhập email của bạn"
            placeholderTextColor={COLOR.sub}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {err ? <Text style={s.err}>{err}</Text> : null}
        {ok ? <Text style={s.ok}>{ok}</Text> : null}

        <TouchableOpacity
          style={[s.primary, disabled && { opacity: 0.5 }]}
          disabled={disabled}
          onPress={onSend}
          activeOpacity={0.8}
        >
          <Text style={s.primaryText}>
            {cooldown > 0
              ? `Gửi lại email (${cooldown}s)`
              : "Gửi email đặt lại mật khẩu"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 12, alignSelf: "center" }}
        >
          <Text style={s.link}>Quay lại màn hình đăng nhập</Text>
        </TouchableOpacity>

        <View style={s.tipsBox}>
          <Text style={s.tipTitle}>Không nhận được email?</Text>
          <Text style={s.tip}>
            • Kiểm tra mục Spam / Thư rác, Promotions (Gmail).
          </Text>
          <Text style={s.tip}>
            • Đảm bảo trong Firebase Authentication đã bật phương thức đăng nhập{" "}
            "Email/Password".
          </Text>
          <Text style={s.tip}>
            • Vào Firebase Console → Authentication → tab Templates → mẫu
            "Password reset", nhập "Sender name" (tên người gửi) rồi Lưu.
          </Text>
          <Text style={s.tip}>
            • Nếu hệ thống báo "too-many-requests", hãy chờ thêm một lúc rồi thử
            lại.
          </Text>
          <Text style={s.tip}>
            • Kiểm tra lại email có đúng tài khoản đã đăng ký (không thiếu ký
            tự, không sai đuôi .com, .vn, …).
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 14, justifyContent: "center" },
  h1: { fontSize: 22, fontWeight: "700", color: COLOR.text },
  sub: { color: COLOR.sub, marginBottom: 4 },
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
  primary: {
    backgroundColor: COLOR.blue,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  err: { color: COLOR.err, marginTop: 6 },
  ok: { color: COLOR.ok, marginTop: 6 },
  tipsBox: {
    marginTop: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  tipTitle: { fontWeight: "700", color: COLOR.text, marginBottom: 6 },
  tip: { color: COLOR.sub, marginTop: 2, fontSize: 13 },
});

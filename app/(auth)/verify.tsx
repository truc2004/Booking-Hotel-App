import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../src/lib/firebase";

export default function VerifyScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckVerified = async () => {
    try {
      setChecking(true);
      setError(null);

      await auth.currentUser?.reload(); // cập nhật trạng thái mới nhất
      const user = auth.currentUser;

      if (user?.emailVerified) {
        router.replace("/(auth)/complete-profile");
      } else {
        setError("Email của bạn chưa được xác thực. Hãy kiểm tra hộp thư (kể cả spam).");
      }
    } catch (e) {
      setError("Có lỗi khi kiểm tra trạng thái xác thực.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
        Xác thực email
      </Text>
      <Text style={{ marginBottom: 16 }}>
        Chúng tôi đã gửi cho bạn một email xác thực. Vui lòng mở email và bấm vào link.
      </Text>

      {error && (
        <Text style={{ color: "red", marginBottom: 12 }}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleCheckVerified}
        style={{
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          backgroundColor: "#007bff",
        }}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Tôi đã bấm link xác thực
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

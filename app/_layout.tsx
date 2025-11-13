import { useAuth } from "@/src/auth/auth-store";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { user, loading, init } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === "(auth)";
    const authScreen = segments[1]; // "sign-in" | "sign-up" | "verify" | "complete-profile" | ...

    // Chưa login mà không ở (auth) -> bắt về sign-in
    if (!user && !inAuth) {
      router.replace("/(auth)/sign-in");
      return;
    }

    // Đã login mà đang ở group (auth)
    if (user && inAuth) {
      // CHỈ chặn sign-in & index, KHÔNG chặn sign-up/verify/complete-profile
      if (authScreen === "sign-in" || !authScreen) {
        router.replace("/(tabs)/home");
      }
    }
  }, [segments, user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}

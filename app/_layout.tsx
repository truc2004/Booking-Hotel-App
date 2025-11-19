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
    const authScreen = segments[1]; // "sign-in" | "sign-up" | ...

    // KHÔNG còn chặn !user nữa => guest vẫn vào được (tabs)/home

    // Đã login mà vẫn ở group (auth) -> đá ra profile
    if (user && inAuth) {
      if (authScreen === "sign-in" || authScreen === "sign-up" || !authScreen) {
        router.replace("/(tabs)/profile");
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

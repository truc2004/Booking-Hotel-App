// import { useAuth } from "@/src/auth/auth-store";
// import { Slot, useRouter, useSegments } from "expo-router";
// import React, { useEffect } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// export default function RootLayout() {
//   const { user, loading, init, justSignedUp } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     init();
//   }, []);

//   useEffect(() => {
//     if (loading) return;

//     const inAuth = segments[0] === "(auth)";
//     const authScreen = segments[1];

//     // 🔥 Nếu vừa đăng ký -> CHỈ CHUYỂN VỀ SIGN-IN
//     if (justSignedUp) {
//       router.replace("/(auth)/sign-in");
//       setTimeout(() => {
//         useAuth.setState({ justSignedUp: false });
//       }, 50);
//       return;
//     }

//     // 🔥 Nếu chưa login → không chặn gì hết
//     if (!user) return;

//     // 🔥 Nếu đã login mà vào (auth) → đẩy ra ngoài
//     if (inAuth && (authScreen === "sign-in" || authScreen === "sign-up")) {
//       router.replace("/(tabs)/profile");
//     }
//   }, [segments, user, loading]);




//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <Slot />
//     </SafeAreaProvider>
//   );
// }


import { useAuth } from "@/src/auth/auth-store";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { user, loading, init, justSignedUp } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // trạng thái để giữ splash 1 khoảng ngắn
  const [splashDone, setSplashDone] = useState(false);

  // init auth
  useEffect(() => {
    init();
  }, []);

  // khi init xong (loading = false) thì cho splash biến mất sau 800ms
  useEffect(() => {
    if (!loading && !splashDone) {
      const timer = setTimeout(() => {
        setSplashDone(true);
      }, 800); // muốn nhanh/chậm hơn chỉnh số ms

      return () => clearTimeout(timer);
    }
  }, [loading, splashDone]);

  // logic điều hướng auth như cũ
  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === "(auth)";
    const authScreen = segments[1]; // "sign-in" | "sign-up" | ...

    // Nếu vừa đăng ký -> chỉ chuyển về sign-in
    if (justSignedUp) {
      router.replace("/(auth)/sign-in");
      setTimeout(() => {
        // tuỳ bạn định nghĩa setState trong auth-store
        // nếu TS báo lỗi, có thể dùng: (useAuth as any).setState(...)
        useAuth.setState({ justSignedUp: false });
      }, 50);
      return;
    }

    // Chưa login → guest vẫn vào được (tabs)/home, không chặn gì
    if (!user) return;

    // Đã login mà vẫn ở (auth) → đẩy ra profile
    if (inAuth && (authScreen === "sign-in" || authScreen === "sign-up" || !authScreen)) {
      router.replace("/(tabs)/profile");
    }
  }, [segments, user, loading, justSignedUp, router]);

  // SPLASH: khi app mới mở (chưa xong init) thì hiển thị logo
  if (!splashDone || loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.splashContainer}>
          <Image
            source={require("../assets/images/LogoBookingApp.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </SafeAreaProvider>
    );
  }

  // App bình thường
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF", // màu nền splash
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
});

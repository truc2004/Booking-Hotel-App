// import ButtonBackScreen from "@/components/ButtonBackScreen";
// import { humanizeAuthError } from "@/src/auth/auth-errors";
// import { useAuth } from "@/src/auth/auth-store";
// import { Ionicons } from "@expo/vector-icons";
// import { Link, router } from "expo-router";
// import React, { useState } from "react";
// import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// const COLOR = { blue: "#2E76FF", sub: "#6B7280", border: "#E5E7EB", text: "#101010" };

// export default function SignIn() {
//   const { signIn } = useAuth();
//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [show, setShow] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const onLogin = async () => {
//     try {
//       setErr(null);
//       await signIn(email.trim(), pass);
//       router.replace("/(tabs)/home");
//     } catch (e: any) {
//       setErr(humanizeAuthError(e));
//     }
//   };

//   const disabled = !email || !pass;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       {/* <View >
//         <TouchableOpacity
//           onPress={() => router.replace("/(tabs)/home")}
//           style={{ flexDirection: "row", alignItems: "center" }}
//         >
//           <Ionicons name="chevron-back" size={22} color="#101010" />
//         </TouchableOpacity>
//       </View> */}
//       <ButtonBackScreen />

//       <View style={s.wrap}>
//         <Image
//           source={require("../../assets/images/LogoBookingApp.png")}
//           style={s.logo}
//           accessibilityLabel="BookingHotel logo"
//         />
//         <Text style={s.h1}>Sign In</Text>
//         <Text style={s.sub}>Hi! Welcome back, you’ve been missed</Text>

//         <View style={s.input}>
//           <Ionicons name="mail-outline" size={20} color={COLOR.sub} />
//           <TextInput
//             style={s.text}
//             placeholder="Email"
//             placeholderTextColor={COLOR.sub}
//             autoCapitalize="none"
//             keyboardType="email-address"
//             value={email}
//             onChangeText={setEmail}
//           />
//         </View>

//         <View style={s.input}>
//           <Ionicons name="lock-closed-outline" size={20} color={COLOR.sub} />
//           <TextInput
//             style={s.text}
//             placeholder="Password"
//             placeholderTextColor={COLOR.sub}
//             secureTextEntry={!show}
//             value={pass}
//             onChangeText={setPass}
//           />
//           <TouchableOpacity onPress={() => setShow((v) => !v)}>
//             <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color={COLOR.sub} />
//           </TouchableOpacity>
//         </View>

//         <View style={{ alignItems: "flex-end" }}>
//           <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
//             <Text style={s.link}>Quên mật khẩu?</Text>
//           </TouchableOpacity>
//         </View>

//         {err ? <Text style={s.err}>{err}</Text> : null}

//         <TouchableOpacity
//           style={[s.primary, disabled && { opacity: 0.5 }]}
//           disabled={disabled}
//           onPress={onLogin}
//           activeOpacity={0.8}
//         >
//           <Text style={s.primaryText}>Sign In</Text>
//         </TouchableOpacity>

//         <View style={s.footer}>
//           <Text style={{ color: COLOR.sub }}>Don’t have an account? </Text>
//           <Link href="/(auth)/sign-up">
//             <Text style={[s.link, { fontWeight: "600" }]}>Sign Up</Text>
//           </Link>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const s = StyleSheet.create({
//   wrap: { flex: 1, padding: 20, gap: 14, justifyContent: "center" },
//   logo: { width: 88, height: 88, alignSelf: "center", marginBottom: 6, resizeMode: "contain" },
//   h1: { fontSize: 24, fontWeight: "700", color: COLOR.text, textAlign: "center" },
//   sub: { color: COLOR.sub, marginTop: 4, textAlign: "center" },
//   input: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     borderWidth: 1,
//     borderColor: COLOR.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 52,
//   },
//   text: { flex: 1, fontSize: 15, color: COLOR.text },
//   link: { color: COLOR.blue, fontSize: 13 },
//   err: { color: "#DC2626", marginTop: 6, textAlign: "center" },
//   primary: { backgroundColor: COLOR.blue, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 6 },
//   primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
//   headerBack: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerBackText: {
//     fontSize: 14,
//     color: "#101010",
//     marginLeft: 4,
//   },

//   footer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
// });


import ButtonBackScreen from "@/components/ButtonBackScreen";
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

const COLOR = { blue: "#2E76FF", sub: "#6B7280", border: "#E5E7EB", text: "#101010" };

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onLogin = async () => {
    try {
      setErr(null);
      await signIn(email.trim(), pass);
      router.replace("/(tabs)/home");
    } catch (e: any) {
      setErr(humanizeAuthError(e));
    }
  };

  const disabled = !email || !pass;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ButtonBackScreen />

      <View style={s.wrap}>
        <Image
          source={require("../../assets/images/LogoBookingApp.png")}
          style={s.logo}
          accessibilityLabel="Logo ứng dụng BookingHotel"
        />
        <Text style={s.h1}>Đăng nhập</Text>
        <Text style={s.sub}>Xin chào! Chào mừng bạn quay trở lại</Text>

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

        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
            <Text style={s.link}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {err ? <Text style={s.err}>{err}</Text> : null}

        <TouchableOpacity
          style={[s.primary, disabled && { opacity: 0.5 }]}
          disabled={disabled}
          onPress={onLogin}
          activeOpacity={0.8}
        >
          <Text style={s.primaryText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={s.footer}>
          <Text style={{ color: COLOR.sub }}>Chưa có tài khoản? </Text>
          <Link href="/(auth)/sign-up">
            <Text style={[s.link, { fontWeight: "600" }]}>Đăng ký</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 14, justifyContent: "center" },
  logo: { width: 88, height: 88, alignSelf: "center", marginBottom: 6, resizeMode: "contain" },
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
  headerBack: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackText: {
    fontSize: 14,
    color: "#101010",
    marginLeft: 4,
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
});

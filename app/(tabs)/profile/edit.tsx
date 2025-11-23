
import ButtonSubmit from "@/components/ButtonSubmit";
import HeaderScreen from "@/components/HeaderScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/auth/auth-store";
import { accountApi } from "@/api/accountApi";
import type { Account } from "@/types/account";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  gray: "#CFCFCF",
  grayWhite: "#EFEFEF",
};

export default function EditProfileScreen() {
  const { user } = useAuth(); 
  

  const [loading, setLoading] = useState<boolean>(true);
  const [account, setAccount] = useState<Account | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Lấy thông tin từ DB theo email
  useEffect(() => {
    const fetchUserFromDb = async () => {
      try {
        if (!user?.email) {
          setLoading(false);
          return;
        }

        const acc = await accountApi.createOrGetAccount(user.email);

        setAccount(acc);
        setName(acc.user_name || "");
        setPhone(acc.phone || "");
        setEmail(acc.email || "");
      } catch (err) {
        console.log("Error load account:", err);
        Alert.alert("Lỗi", "Không tải được thông tin tài khoản.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserFromDb();
  }, [user?.email]);

  const handleUpdate = async () => {
    try {
      if (!account) return;

      setLoading(true);

      const updated = await accountApi.updateAccount(account.account_id, {
        user_name: name,
        phone: phone,
        email: email,
      });

      setAccount(updated);
      Alert.alert("Thành công", "Đã cập nhật thông tin vào cơ sở dữ liệu.");
      router.push({ pathname: "/(tabs)/profile" });
    } catch (err) {
      console.log("Error update account:", err);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

   if (loading)
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2E76FF" />
        </View>
      );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderScreen title="Thông tin của bạn" />

      {/* Avatar */}
      <View style={styles.center}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.avatarEdit}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Field label="Tên">
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={COLOR.gray}
          />
        </Field>

        <Field label="Số điện thoại">
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Enter phone"
            placeholderTextColor={COLOR.gray}
          />
        </Field>

        <Field label="Email">
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            placeholder="Enter email"
            placeholderTextColor={COLOR.gray}
            autoCapitalize="none"
          />
        </Field>

        <TouchableOpacity style={{backgroundColor: '#2E76FF', padding: 10, justifyContent: "center", alignItems: "center", borderRadius: 15, marginTop: 15,
         }}  onPress={handleUpdate} >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
  Cập nhật thông tin
</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  children,
  right,
}: {
  label: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Text style={styles.label}>{label}</Text>
        {right}
      </View>
      {children}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    height: 44,

  },
  topTitle: { fontSize: 18, fontWeight: "600", color: "#101010" },
  center: { alignItems: "center", marginVertical: 12, marginTop: 50 },
  avatarWrap: { position: "relative" },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarEdit: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2E76FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  form: { paddingHorizontal: 16, marginTop: 8 },
  fieldContainer: { marginBottom: 14 },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  // TITLE field: font 13
  label: {
    color: "#101010",
    fontWeight: "500",
    fontSize: 13,
  },
  // TEXT trong input: font 12
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    paddingHorizontal: 12,
    backgroundColor: "#EFEFEF",
    color: "#101010",
    fontSize: 12,
  },
  link: { color: "#2E76FF", fontWeight: "600" },

  btn: {
    marginTop: 18,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2E76FF",
    alignItems: "center",
    justifyContent: "center",
  },
  // Nếu có dùng btn + btnText thì text nút: font 13
  btnText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  genderRow: {
    flexDirection: "row",
    gap: 10,
  },
  genderOption: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
  },
  genderOptionActive: {
    borderColor: COLOR.blue,
    backgroundColor: "#E0ECFF",
  },
  genderText: {
    color: "#101010",
    fontSize: 12,       // nếu muốn đồng bộ content = 12
  },
  genderTextActive: {
    color: COLOR.blue,
    fontWeight: "600",
    fontSize: 12,       // idem
  },
});

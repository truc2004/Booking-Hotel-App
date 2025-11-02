import ButtonBottom from "@/components/ButtonBottom";
import HeaderScreen from "@/components/HeaderScreen";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  grayWhite: "#EFEFEF",
  white: "#FFFFFF",
};

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChange}
          style={styles.input}
          secureTextEntry={!show}
        />
        <TouchableOpacity onPress={() => setShow((p) => !p)}>
          <Ionicons
            name={show ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PasswordScreen() {
  const [current, setCurrent] = useState("************");
  const [next, setNext] = useState("************");
  const [confirm, setConfirm] = useState("************");

  const handleSubmit = () => {
    // xử lý đổi mật khẩu
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Quản lý mật khẩu" />

      <View style={styles.form}>
        <PasswordField
          label="Mật khẩu hiện tại"
          value={current}
          onChange={setCurrent}
        />
        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <PasswordField
          label="Mật khẩu mới"
          value={next}
          onChange={setNext}
        />
        <PasswordField
          label="Xác nhận mật khẩu mới"
          value={confirm}
          onChange={setConfirm}
        />
      </View>

      <ButtonBottom title="Đổi mật khẩu" onPress={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },
  form: { paddingHorizontal: 16, marginTop: 20, paddingBottom: 120 },
  label: { fontSize: 14, color: COLOR.black, marginBottom: 6 },
  inputWrap: {
    height: 48,
    borderRadius: 12,
    backgroundColor: COLOR.grayWhite,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  input: { flex: 1, color: COLOR.black },
  forgot: { alignSelf: "flex-end", marginBottom: 14 },
  forgotText: { color: COLOR.blue, fontWeight: "500" },
});

import HeaderScreen from "@/components/HeaderScreen";
import React, { useState } from "react";
import {
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  gray: "#CFCFCF",
  grayWhite: "#EFEFEF",
  white: "#FFFFFF",
};

export default function NotificationSettingScreen() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibrate, setVibrate] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen title="Cài đặt thông báo" />

      <View style={styles.list}>
        <Row
          label="Thông báo đẩy"
          desc="Nhận thông báo trực tiếp trên điện thoại"
          value={push}
          onValueChange={setPush}
        />
        <Row
          label="Email khuyến mãi"
          desc="Nhận tin khuyến mãi và ưu đãi qua email"
          value={email}
          onValueChange={setEmail}
        />
        <Row
          label="Tin nhắn hệ thống"
          desc="Cập nhật trạng thái đơn đặt"
          value={sms}
          onValueChange={setSms}
        />
        <Row
          label="Âm thanh"
          desc="Bật âm báo khi có thông báo"
          value={sound}
          onValueChange={setSound}
        />
        <Row
          label="Rung"
          desc="Rung khi có thông báo"
          value={vibrate}
          onValueChange={setVibrate}
        />
      </View>
    </SafeAreaView>
  );
}

function Row({
  label,
  desc,
  value,
  onValueChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {desc ? <Text style={styles.rowDesc}>{desc}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#DADADA", true: "#2E76FF" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },
  list: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 14,
  },
  row: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFEF",
  },
  rowLabel: { fontSize: 15, fontWeight: "600", color: COLOR.black },
  rowDesc: { fontSize: 12, color: "#555", marginTop: 2 },
});

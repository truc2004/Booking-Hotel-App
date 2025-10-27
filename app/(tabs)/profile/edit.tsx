import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR = {
  blue: "#2E76FF",
  black: "#101010",
  gray: "#CFCFCF",
  grayWhite: "#EFEFEF",
};

export default function EditProfileScreen() {
  const [name, setName] = useState("Esther Howard");
  const [phone, setPhone] = useState("603.555.0123");
  const [email, setEmail] = useState("example@gmail.com");
  const [dob, setDob] = useState("20/12/2000");
  const [gender, setGender] = useState("Female");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color={COLOR.black} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Avatar */}
      <View style={styles.center}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: "https://i.pravatar.cc/160?img=12" }}
            style={styles.avatar}
          />
          <View style={styles.avatarEdit}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Field label="Name">
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={COLOR.gray}
          />
        </Field>

        <Field
          label="Phone Number"
          right={
            <TouchableOpacity>
              <Text style={styles.link}>Change</Text>
            </TouchableOpacity>
          }
        >
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
          />
        </Field>

        <Field label="Date of Birth">
          <TextInput
            value={dob}
            onChangeText={setDob}
            style={styles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={COLOR.gray}
          />
        </Field>

        <Field label="Gender">
          <TextInput
            value={gender}
            onChangeText={setGender}
            style={styles.input}
            placeholder="Male / Female"
            placeholderTextColor={COLOR.gray}
          />
        </Field>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Update Profile</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    height: 44,
  },
  topTitle: { fontSize: 16, fontWeight: "600", color: "#101010" },
  center: { alignItems: "center", marginVertical: 12 },
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
  label: { color: "#101010", fontWeight: "500" },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    paddingHorizontal: 12,
    backgroundColor: "#EFEFEF",
    color: "#101010",
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
  btnText: { color: "#fff", fontWeight: "700" },
});

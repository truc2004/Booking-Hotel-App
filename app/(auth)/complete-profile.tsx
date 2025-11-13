import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const COLOR = { blue:"#2E76FF", text:"#101010", sub:"#6B7280", border:"#E5E7EB" };

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("+84");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male"|"female"|"other"|"">("");

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:"#fff" }}>
      <View style={s.wrap}>
        <Text style={s.h1}>Complete Your Profile</Text>
        <Text style={s.sub}>Don’t worry, only you can see your personal data</Text>

        <View style={s.avatar}>
          <Ionicons name="person" size={48} color="#9CA3AF" />
          <View style={s.badge}><Ionicons name="pencil" size={14} color="#fff" /></View>
        </View>

        <View style={{ gap:14 }}>
          <View style={s.input}>
            <TextInput style={s.text} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={COLOR.sub} />
          </View>

          <View style={{ flexDirection:"row", gap:10 }}>
            <View style={[s.input,{ flex:0.9 }]}>
              <TextInput style={s.text} value={code} onChangeText={setCode} placeholder="+1" placeholderTextColor={COLOR.sub} />
            </View>
            <View style={[s.input,{ flex:2 }]}>
              <TextInput style={s.text} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Enter Phone Number" placeholderTextColor={COLOR.sub} />
            </View>
          </View>

          <View style={s.selectRow}>
            {[
              { k:"male", label:"Male" },
              { k:"female", label:"Female" },
              { k:"other", label:"Other" },
            ].map(it => (
              <TouchableOpacity key={it.k} style={[s.sel, gender===it.k && s.selActive]} onPress={()=>setGender(it.k as any)}>
                <Text style={[s.selText, gender===it.k && { color:"#fff" }]}>{it.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={s.primary} onPress={() => router.replace("/(tabs)/home")} activeOpacity={0.8}>
          <Text style={s.primaryText}>Complete Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap:{ flex:1, padding:20, gap:16, justifyContent:"center" },
  h1:{ fontSize:24, fontWeight:"700", color:COLOR.text, textAlign:"center" },
  sub:{ color:COLOR.sub, textAlign:"center" },
  avatar:{ width:92, height:92, borderRadius:999, backgroundColor:"#EEF2F7", alignSelf:"center", alignItems:"center", justifyContent:"center", marginVertical:12 },
  badge:{ position:"absolute", bottom:4, right:4, width:22, height:22, borderRadius:11, backgroundColor:COLOR.blue, alignItems:"center", justifyContent:"center" },
  input:{ flexDirection:"row", alignItems:"center", gap:10, borderWidth:1, borderColor:COLOR.border, borderRadius:12, paddingHorizontal:12, height:52 },
  text:{ flex:1, fontSize:15, color:COLOR.text },
  selectRow:{ flexDirection:"row", gap:10 },
  sel:{ flex:1, height:44, borderRadius:10, borderWidth:1, borderColor:COLOR.border, alignItems:"center", justifyContent:"center" },
  selActive:{ backgroundColor:COLOR.blue, borderColor:COLOR.blue },
  selText:{ color:COLOR.text, fontWeight:"600" },
  primary:{ backgroundColor:COLOR.blue, height:52, borderRadius:14, alignItems:"center", justifyContent:"center", marginTop:8 },
  primaryText:{ color:"#fff", fontSize:16, fontWeight:"700" },
});

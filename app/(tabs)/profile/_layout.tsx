import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="setting" />
      <Stack.Screen name="password" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="helpCenter" />
      <Stack.Screen name="historyBooking" />
    </Stack>
  );
}

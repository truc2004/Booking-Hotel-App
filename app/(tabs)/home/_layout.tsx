import { Stack } from "expo-router";
import React from 'react';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hiện header riêng từng screen
      }}
    >
      <Stack.Screen
        name="index"         // home screen
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="booking"       // stack screen, không hiện tab
        options={{ title: "Booking" }}
      />
      <Stack.Screen
        name="roomDetail"    // stack screen, không hiện tab
        options={{ title: "Room Detail" }}
      />
    </Stack>
  );
}

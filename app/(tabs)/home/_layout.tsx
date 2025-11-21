import { Stack } from "expo-router";
import React from "react";

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="listRoom" options={{ title: "List Room" }} />
      <Stack.Screen name="search" options={{ title: "Search" }} />
      <Stack.Screen name="booking" options={{ title: "Booking" }} />
      <Stack.Screen name="roomDetail" options={{ title: "Room Detail" }} />
      <Stack.Screen name="filter" options={{ title: "Filter" }} />
    </Stack>
  );
}

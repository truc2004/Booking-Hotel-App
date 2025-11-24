import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="historyBooking"
        options={{
          title: "Đơn của tôi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" color={color} size={size} />
          ),
        }}
      />
       <Tabs.Screen
        name="message"
        options={{
          title: "Tin nhắn",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Entry point của app là tab layout */}
        <Stack.Screen name="(tabs)/home" />
        <Stack.Screen name="(tabs)/profile" />
      </Stack>
    </SafeAreaProvider>
  );
}

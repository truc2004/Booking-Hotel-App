// app/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
       
        <Stack.Screen name="roomDetail" options={{ presentation: "modal" }} />
        <Stack.Screen name="booking" options={{ presentation: "modal" }} />


        <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

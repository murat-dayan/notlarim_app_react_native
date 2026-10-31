import { useNotesStore } from "@/features/notes/store/useNotesStore";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. Tüm hook'lar en üstte ve sırası hiç değişmeyecek şekilde çağrılmalı
  const [fontsLoaded] = useFonts({
    BuildStorm: require("../../assets/fonts/RubikStorm-Regular.ttf"),
  });

  const loadNotes = useNotesStore((s) => s.loadNotes);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // 2. Koşullu kontrol (Early return) en sonda yapılmalı
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="editor" options={{ headerShown: false }} />
    </Stack>
  );
}

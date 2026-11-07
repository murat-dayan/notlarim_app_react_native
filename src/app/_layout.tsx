import { useNotesStore } from "@/features/notes/store/notesStore";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BuildStorm: require("../../assets/fonts/RubikStorm-Regular.ttf"),
  });

  const loadNotes = useNotesStore((s) => s.loadNotes);
  const loadWorkspaces = useNotesStore((s) => s.loadWorkspaces); // 🔥 Eklendi

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    loadNotes();
    loadWorkspaces(); // 🔥 Uygulama açılır açılmaz çalışma alanlarını yüklüyoruz
  }, [loadNotes, loadWorkspaces]);

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
      <Stack.Screen name="locked-notes" options={{ headerShown: false }} />
      <Stack.Screen name="zen-editor" options={{ headerShown: false }} />
    </Stack>
  );
}

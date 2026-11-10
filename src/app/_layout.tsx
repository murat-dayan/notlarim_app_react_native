import { GlobalConfirmModal } from "@/components/GlobalConfirmModal";
import { useNotesStore } from "@/features/notes/store/notesStore";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BuildStorm: require("../../assets/fonts/RubikStorm-Regular.ttf"),
    Aladin: require("../../assets/fonts/Aladin-Regular.ttf"),
    Amarante: require("../../assets/fonts/Amarante-Regular.ttf"),
  });

  const loadNotes = useNotesStore((s) => s.loadNotes);
  const loadWorkspaces = useNotesStore((s) => s.loadWorkspaces);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    loadNotes();
    loadWorkspaces();
  }, [loadNotes, loadWorkspaces]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    // 🔥 Stack bileşenini bir View içine alıp altına GlobalConfirmModal'ı ekliyoruz
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="editor" options={{ headerShown: false }} />
        <Stack.Screen name="locked-notes" options={{ headerShown: false }} />
        <Stack.Screen name="zen-editor" options={{ headerShown: false }} />
      </Stack>

      {/* 🔥 İşte ekranda görünmesini sağlayacak sihirli dokunuş burada! */}
      <GlobalConfirmModal />
    </View>
  );
}

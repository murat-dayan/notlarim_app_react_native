import { useNotesStore } from "@/features/notes/store/useNotesStore";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const loadNotes = useNotesStore((s) => s.loadNotes);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="editor" options={{ headerShown: false }} />
    </Stack>
  );
}

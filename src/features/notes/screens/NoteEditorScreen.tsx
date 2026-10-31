import { Colors } from "@/constants/colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotesStore } from "../store/useNotesStore";

export function NoteEditorScreen() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const { id } = useLocalSearchParams<{ id?: string }>();

  const existing = useNotesStore((s) => s.notes.find((n) => n.id === id));

  const addNote = useNotesStore((s) => s.addNote);
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      router.back();
      return;
    }
    if (id) {
      await updateNote(id, title, content);
    } else {
      await addNote(title, content);
    }
    router.back();
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert("Notu sil", "Bu not kalıcı olarak silinecek.", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          await deleteNote(id);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Stack.Screen options={{ title: id ? "Notu düzenle" : "Yeni not" }} />

      <TextInput
        style={styles.titleInput}
        placeholder="Başlık"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Notunu yaz..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      <View style={[styles.buttons, { paddingBottom: insets.bottom + 45 }]}>
        {id && (
          <Pressable
            style={[styles.button, styles.delete]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Sil</Text>
          </Pressable>
        )}
        <Pressable style={[styles.button, styles.save]} onPress={handleSave}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 12,
  },
  contentInput: { flex: 1, fontSize: 16 },
  buttons: { flexDirection: "row", gap: 12, paddingTop: 12 },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  save: { backgroundColor: Colors.primary },
  delete: { backgroundColor: Colors.error },
  buttonText: { color: Colors.textSecondary, fontSize: 16, fontWeight: "600" },
});

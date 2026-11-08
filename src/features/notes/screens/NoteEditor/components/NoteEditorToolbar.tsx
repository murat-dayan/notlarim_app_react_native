// NoteEditor/components/NoteEditorToolbar.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

type NoteEditorToolbarProps = {
  content: string;
  todos: any[];
  audioUri: string | null;
  currentPrimaryColor: string;
  handleAddBullet: () => void;
  styles: any;
};

export function NoteEditorToolbar({
  content,
  todos,
  audioUri,
  currentPrimaryColor,
  handleAddBullet,
  styles,
}: NoteEditorToolbarProps) {
  const router = useRouter();

  return (
    <View style={styles.editorToolbar}>
      <Pressable style={styles.toolbarButton} onPress={handleAddBullet}>
        <Ionicons name="list" size={18} color={currentPrimaryColor} />
        <Text style={styles.toolbarButtonText}>Madde Ekle</Text>
      </Pressable>

      <Pressable
        style={styles.toolbarButton}
        onPress={() =>
          router.push({
            pathname: "/zen-editor",
            params: {
              currentContent: content,
              currentTodos: JSON.stringify(todos),
              currentAudioUri: audioUri ?? "",
            },
          })
        }
      >
        <Ionicons name="expand-outline" size={18} color={currentPrimaryColor} />
        <Text style={styles.toolbarButtonText}>Zen Modu</Text>
      </Pressable>
    </View>
  );
}

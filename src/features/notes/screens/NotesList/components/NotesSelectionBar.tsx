// NotesList/components/NotesSelectionBar.tsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type NotesSelectionBarProps = {
  selectedNoteIds: string[];
  clearSelection: () => void;
  isAllSelected: boolean;
  handleToggleSelectAll: () => void;
  toggleLockNote: (id: string) => void;
  deleteSelectedNotes: () => void;
  currentPrimaryColor: string;
  bottomInset: number;
  styles: any;
};

export function NotesSelectionBar({
  selectedNoteIds,
  clearSelection,
  isAllSelected,
  handleToggleSelectAll,
  toggleLockNote,
  deleteSelectedNotes,
  currentPrimaryColor,
  bottomInset,
  styles,
}: NotesSelectionBarProps) {
  return (
    <View
      style={[
        styles.selectionFloatingBar,
        {
          backgroundColor: currentPrimaryColor,
          bottom: bottomInset + 16,
          shadowColor: currentPrimaryColor,
        },
      ]}
    >
      <View style={styles.selectionLeftInfo}>
        <Pressable onPress={clearSelection} hitSlop={8}>
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.selectionCountBadge}>
          {selectedNoteIds.length} seçildi
        </Text>
      </View>

      <View style={styles.selectionRightActions}>
        <Pressable
          style={[
            styles.actionIconButton,
            isAllSelected && {
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            },
          ]}
          onPress={handleToggleSelectAll}
          hitSlop={6}
        >
          <Ionicons
            name={isAllSelected ? "checkbox" : "checkbox-outline"}
            size={20}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          style={styles.actionIconButton}
          onPress={() => {
            selectedNoteIds.forEach((id) => toggleLockNote(id));
            clearSelection();
          }}
          hitSlop={6}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />
        </Pressable>

        <Pressable
          style={[styles.actionIconButton, styles.deleteIconButton]}
          onPress={() => deleteSelectedNotes()}
          hitSlop={6}
        >
          <Ionicons name="trash-outline" size={20} color="#FFD1D1" />
        </Pressable>
      </View>
    </View>
  );
}

import { Colors } from "@/constants/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Note } from "../types";

type Props = {
  note: Note;
  onPress: () => void;
  onLongPress: () => void;
  isSelected: boolean;
  isSelectionMode: boolean;
};

export function NoteCard({
  note,
  onPress,
  onLongPress,
  isSelected,
  isSelectionMode,
}: Props) {
  return (
    <Pressable
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {isSelectionMode && (
        <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}

      <Text style={styles.title} numberOfLines={2}>
        {note.title}
      </Text>

      <Text style={styles.content} numberOfLines={2}>
        {note.content}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: "#EEF2FF", // Hafif bir mavi/morumsu seçili arka planı
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkedBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});

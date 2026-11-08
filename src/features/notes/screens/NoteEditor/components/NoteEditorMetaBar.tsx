// NoteEditor/components/NoteEditorMetaBar.tsx
import { getCurrentFormattedTime } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type NoteEditorMetaBarProps = {
  characterCount: number;
  currentPrimaryColor: string;
  styles: any;
};

export function NoteEditorMetaBar({
  characterCount,
  currentPrimaryColor,
  styles,
}: NoteEditorMetaBarProps) {
  return (
    <View style={styles.editorHeaderMeta}>
      <View
        style={[styles.metaBadge, { borderColor: currentPrimaryColor + "40" }]}
      >
        <Ionicons name="time-outline" size={13} color={currentPrimaryColor} />
        <Text style={[styles.metaText, { color: currentPrimaryColor }]}>
          {getCurrentFormattedTime()}
        </Text>
      </View>

      <View
        style={[styles.metaBadge, { borderColor: currentPrimaryColor + "40" }]}
      >
        <Ionicons name="text-outline" size={13} color={currentPrimaryColor} />
        <Text style={[styles.metaText, { color: currentPrimaryColor }]}>
          {characterCount} karakter
        </Text>
      </View>
    </View>
  );
}

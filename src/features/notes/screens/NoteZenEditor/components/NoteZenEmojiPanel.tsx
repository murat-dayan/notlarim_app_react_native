import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const QUICK_EMOJIS = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🔥",
  "🎯",
  "💡",
  "✅",
  "⭐",
  "🎉",
];

type NoteZenEmojiPanelProps = {
  isEmojiPanelOpen: boolean;
  isEmojiPanelMinimized: boolean;
  currentPrimaryColor: string;
  handleMinimizeEmojiPanel: () => void;
  handleCloseEmojiPanel: () => void;
  handleRestoreEmojiPanel: () => void;
  handleInsertEmoji: (emoji: string) => void;
  styles: any;
};

export function NoteZenEmojiPanel({
  isEmojiPanelOpen,
  isEmojiPanelMinimized,
  currentPrimaryColor,
  handleMinimizeEmojiPanel,
  handleCloseEmojiPanel,
  handleRestoreEmojiPanel,
  handleInsertEmoji,
  styles,
}: NoteZenEmojiPanelProps) {
  if (!isEmojiPanelOpen) return null;

  if (isEmojiPanelMinimized) {
    return (
      <TouchableOpacity
        onPress={handleRestoreEmojiPanel}
        activeOpacity={0.7}
        style={[
          styles.minimizedEmojiBubble,
          { borderColor: currentPrimaryColor + "40" },
        ]}
      >
        <Ionicons name="happy-outline" size={20} color={currentPrimaryColor} />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[styles.emojiPanel, { borderColor: currentPrimaryColor + "30" }]}
    >
      <View style={styles.emojiPanelHeader}>
        <TouchableOpacity
          onPress={handleMinimizeEmojiPanel}
          hitSlop={8}
          style={styles.emojiHeaderBtn}
        >
          <Ionicons name="chevron-down" size={18} color={currentPrimaryColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCloseEmojiPanel}
          hitSlop={8}
          style={styles.emojiHeaderBtn}
        >
          <Ionicons name="close" size={18} color={currentPrimaryColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.emojiGrid}>
        {QUICK_EMOJIS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            onPress={() => handleInsertEmoji(emoji)}
            style={styles.emojiButton}
            activeOpacity={0.6}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

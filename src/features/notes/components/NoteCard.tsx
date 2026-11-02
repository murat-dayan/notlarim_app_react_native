import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNotesStore } from "../store/useNotesStore";
import { Note } from "../types";

type Props = {
  note: Note;
  onPress: () => void;
  onLongPress: () => void;
  onTogglePin: () => void;
  isSelected: boolean;
  isSelectionMode: boolean;
};

export function NoteCard({
  note,
  onPress,
  onLongPress,
  onTogglePin,
  isSelected,
  isSelectionMode,
}: Props) {
  // 🔥 Aktif çalışma alanının rengini store'dan alıyoruz
  const activeWorkspaceId = useNotesStore((s) => s.activeWorkspaceId);
  const workspaces = useNotesStore((s) => s.workspaces);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;

  const formattedDate = new Date(
    note.updatedAt || Date.now(),
  ).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isSelected && [
          styles.selectedCard,
          {
            borderColor: currentPrimaryColor,
            backgroundColor: `${currentPrimaryColor}0D`,
          }, // Hafif renk tonu
        ],
        pressed && styles.pressedCard,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {/* Sol taraftaki şık dikey aksan çizgisi */}
      <View
        style={[styles.accentBar, { backgroundColor: currentPrimaryColor }]}
      />

      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title || "Başlıksız Not"}
          </Text>

          {/* 🔥 SEÇİM MODUNDAYSA SAĞ ÜSTTE PIN İKONU BELİRİR */}
          {isSelectionMode ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
              style={[
                styles.selectionPinButton,
                {
                  backgroundColor: `${currentPrimaryColor}15`,
                  borderColor: `${currentPrimaryColor}30`,
                },
              ]}
              hitSlop={8}
            >
              <Ionicons
                name={note.isPinned ? "pin" : "pin-outline"}
                size={16}
                color={currentPrimaryColor}
              />
            </Pressable>
          ) : (
            /* Normal durum: Sadece pinlenmişse minik rozet görünür */
            note.isPinned && (
              <View style={styles.pinnedBadge}>
                <Ionicons name="pin" size={13} color={currentPrimaryColor} />
              </View>
            )
          )}
        </View>

        {/* İçerik */}
        <Text style={styles.content} numberOfLines={2}>
          {note.content || "İçerik bulunmuyor..."}
        </Text>

        {/* 🔥 Etiketler */}
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text
                  style={[styles.tagBadgeText, { color: currentPrimaryColor }]}
                >
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Alt Bilgi */}
        <View style={styles.footerRow}>
          <View style={styles.leftFooter}>
            <View
              style={[
                styles.tagIndicator,
                { backgroundColor: currentPrimaryColor },
              ]}
            />
            <Text style={styles.noteTypeLabel}>Not</Text>
          </View>

          <View style={styles.rightFooter}>
            <Text style={styles.dateText}>{formattedDate}</Text>

            {/* Minimalist Yuvarlak Seçim Dairesi */}
            {isSelectionMode && (
              <View
                style={[
                  styles.modernCheckbox,
                  isSelected && [
                    styles.modernCheckedBox,
                    {
                      backgroundColor: currentPrimaryColor,
                      borderColor: currentPrimaryColor,
                    },
                  ],
                ]}
              >
                {isSelected && <View style={styles.innerDot} />}
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAEEF4",
    flexDirection: "row",
    alignItems: "stretch",
    overflow: "hidden",
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  pressedCard: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  selectedCard: {
    // Dinamik renk ile eziliyor
  },
  accentBar: {
    width: 5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  textContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.2,
  },
  pinnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  content: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 21,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  selectionPinButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
  },
  tagBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  leftFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  noteTypeLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
  },
  rightFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  modernCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  modernCheckedBox: {
    // Dinamik renk ile eziliyor
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});

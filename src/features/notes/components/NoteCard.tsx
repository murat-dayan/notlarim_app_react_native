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
        isSelected && styles.selectedCard,
        pressed && styles.pressedCard,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {/* Sol taraftaki şık dikey aksan çizgisi */}
      <View
        style={[styles.accentBar, isSelected && styles.selectedAccentBar]}
      />

      <View style={styles.textContainer}>
        {/* Başlık */}
        <Text style={styles.title} numberOfLines={1}>
          {note.title || "Başlıksız Not"}
        </Text>

        {/* İçerik */}
        <Text style={styles.content} numberOfLines={2}>
          {note.content || "İçerik bulunmuyor..."}
        </Text>

        {/* Alt Bilgi */}
        <View style={styles.footerRow}>
          <View style={styles.leftFooter}>
            <View style={styles.tagIndicator} />
            <Text style={styles.noteTypeLabel}>Not</Text>
          </View>

          <View style={styles.rightFooter}>
            <Text style={styles.dateText}>{formattedDate}</Text>

            {/* 🔥 Tik İşaretsiz, Sadece Renk Dolan Minimalist Daire */}
            {isSelectionMode && (
              <View
                style={[
                  styles.modernCheckbox,
                  isSelected && styles.modernCheckedBox,
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
    marginBottom: 14,
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
    borderColor: Colors.primary,
    backgroundColor: "#F5F7FF",
  },
  accentBar: {
    width: 5,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  selectedAccentBar: {
    backgroundColor: "#4338ca",
  },
  textContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 21,
    marginBottom: 12,
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
    backgroundColor: Colors.primary,
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
  // Minimalist Yuvarlak Seçim Alanı
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  // İçindeki minik nokta (İstersen tamamen boş bırakıp arka plan rengiyle de doldurabilirsin,
  // burada içine minik şık bir beyaz nokta koyduk ya da tamamen renklendirdik)
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});

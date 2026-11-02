import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NoteCard } from "../components/NoteCard";
import { NoteCustomHeader } from "../components/NoteCustomHeader";
import { NoteSwipeableItem } from "../components/NoteSwıpeableItem";
import { useNotesStore } from "../store/useNotesStore";

export function NoteLockedNotesScreen() {
  const router = useRouter();
  const notes = useNotesStore((state) => state.notes);
  const toggleLockNote = useNotesStore((state) => state.toggleLockNote);

  const lockedNotes = notes.filter((n) => n.isLocked);

  return (
    <View style={styles.container}>
      <NoteCustomHeader
        title="Gizli Notlar"
        leftIcon={<Ionicons name="arrow-back" size={20} />}
        onLeftPress={router.back}
      />

      {lockedNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>Kilitlenmiş hiç notun yok.</Text>
        </View>
      ) : (
        <FlatList
          data={lockedNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteSwipeableItem
              // Sola çekince sadece "Kaldır" çalışır
              onSwipeLeft={() => toggleLockNote(item.id)}
              leftActionText="Kaldır"
              leftActionIcon="lock-open-outline"
              leftActionColor={Colors.error}
              // Sağa çekince sadece "Düzenle" çalışır
              onSwipeRight={() =>
                router.push({ pathname: "/editor", params: { id: item.id } })
              }
              rightActionText="Düzenle"
              rightActionIcon="create-outline"
              rightActionColor="#3b82f6"
            >
              <NoteCard
                note={item}
                isSelected={false}
                isSelectionMode={false}
                onPress={() =>
                  router.push({ pathname: "/editor", params: { id: item.id } })
                }
                onLongPress={() => {}}
                onTogglePin={() => {}}
              />
            </NoteSwipeableItem>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listContainer: { paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
});

import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteCard } from "../components/NoteCard";
import NoteLoadingView from "../components/NoteLoadingView";
import { NoteSearchBar } from "../components/NoteSearchBar";
import { useNotesStore } from "../store/useNotesStore";

export function NotesListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const notes = useNotesStore((s) => s.notes);
  const isLoading = useNotesStore((s) => s.isLoading);

  const searchQuery = useNotesStore((s) => s.searchQuery);
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery);

  const sortBy = useNotesStore((s) => s.sortBy); // <-- Eklendi
  const setSortBy = useNotesStore((s) => s.setSortBy); // <-- Eklendi

  const isSortMenuOpen = useNotesStore((s) => s.isSortMenuOpen);
  const toggleSortMenu = useNotesStore((s) => s.toggleSortMenu);
  const closeSortMenu = useNotesStore((s) => s.closeSortMenu);

  const isSearchOpen = useNotesStore((s) => s.isSearchOpen);
  const toggleSearch = useNotesStore((s) => s.toggleSearch);

  const isSelectionMode = useNotesStore((s) => s.isSelectionMode);
  const selectedNoteIds = useNotesStore((s) => s.selectedNoteIds);

  const toggleSelectNote = useNotesStore((s) => s.toggleSelectNote);
  const selectAllNotes = useNotesStore((s) => s.selectAllNotes);
  const clearSelection = useNotesStore((s) => s.clearSelection);
  const deleteSelectedNotes = useNotesStore((s) => s.deleteSelectedNotes);

  if (isLoading) {
    return <NoteLoadingView />;
  }

  const filteredNotes = notes
    .filter((note) => {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "en yeniler") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      } else if (sortBy === "en eskiler") {
        return (
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      } else if (sortBy === "alfabetik") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleCardPress = (id: string) => {
    if (isSelectionMode) {
      toggleSelectNote(id);
    } else {
      router.push({ pathname: "/editor", params: { id } });
    }
  };

  return (
    <View style={styles.container}>
      {/* SEÇİM MODU AKTİFSE ÜST BAR */}
      {isSelectionMode ? (
        <View style={[styles.selectionHeader, { paddingTop: insets.top + 10 }]}>
          <View style={styles.selectionInfo}>
            <Pressable onPress={clearSelection}>
              <Text style={styles.cancelText}>✕ İptal</Text>
            </Pressable>
            <Text style={styles.selectedCountText}>
              {selectedNoteIds.length} seçildi
            </Text>
          </View>

          <View style={styles.selectionActions}>
            <Pressable style={styles.actionBtn} onPress={selectAllNotes}>
              <Text style={styles.actionBtnText}>Hepsini Seç</Text>
            </Pressable>

            <Pressable
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => deleteSelectedNotes()}
            >
              <Text style={styles.deleteBtnText}>Sil</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={[styles.normalHeader, { paddingTop: insets.top + 10 }]}>
          {isSearchOpen ? (
            <View style={styles.searchBarContainer}>
              <View style={{ flex: 1 }}>
                <NoteSearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <Pressable style={styles.iconButton} onPress={toggleSearch}>
                <Ionicons name="close" size={22} color={Colors.textMain} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.headerContent}>
              <View style={styles.headerIcons}>
                <Pressable style={styles.iconButton} onPress={toggleSearch}>
                  <Ionicons name="search" size={20} color={Colors.textMain} />
                </Pressable>

                {/* Filtre İkonu ve Açılır Menüsü */}
                <View style={{ position: "relative" }}>
                  <Pressable style={styles.iconButton} onPress={toggleSortMenu}>
                    <Ionicons
                      name="filter-outline"
                      size={20}
                      color={Colors.textMain}
                    />
                  </Pressable>

                  {/* === BUTONUN ALTINDA AÇILAN MENÜ === */}
                  {isSortMenuOpen && (
                    <View style={styles.dropdownMenu}>
                      <Text style={styles.menuTitle}>Sıralama Ölçütü</Text>

                      <Pressable
                        style={[
                          styles.menuItem,
                          sortBy === "en yeniler" && styles.activeMenuItem,
                        ]}
                        onPress={() => {
                          setSortBy("en yeniler");
                          closeSortMenu();
                        }}
                      >
                        <Text
                          style={[
                            styles.menuText,
                            sortBy === "en yeniler" && styles.activeMenuText,
                          ]}
                        >
                          En Yeni
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.menuItem,
                          sortBy === "en eskiler" && styles.activeMenuItem,
                        ]}
                        onPress={() => {
                          setSortBy("en eskiler");
                          closeSortMenu();
                        }}
                      >
                        <Text
                          style={[
                            styles.menuText,
                            sortBy === "en eskiler" && styles.activeMenuText,
                          ]}
                        >
                          En Eski
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.menuItem,
                          sortBy === "alfabetik" && styles.activeMenuItem,
                        ]}
                        onPress={() => {
                          setSortBy("alfabetik");
                          closeSortMenu();
                        }}
                      >
                        <Text
                          style={[
                            styles.menuText,
                            sortBy === "alfabetik" && styles.activeMenuText,
                          ]}
                        >
                          Alfabetik (A-Z)
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      <FlatList
        data={filteredNotes}
        keyExtractor={(n) => n.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: insets.bottom + 90,
            paddingTop: isSelectionMode ? 20 : 16,
          },
        ]}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery
              ? "Aradığınız kritere uygun not bulunamadı."
              : "Henüz not yok. + ile ilk notunu ekle."}
          </Text>
        }
        renderItem={({ item }) => {
          const isSelected = selectedNoteIds.includes(item.id);
          return (
            <NoteCard
              note={item}
              isSelected={isSelected}
              isSelectionMode={isSelectionMode}
              onPress={() => handleCardPress(item.id)}
              onLongPress={() => toggleSelectNote(item.id)}
            />
          );
        }}
      />

      {/* Seçim modunda değilse FAB (ekle butonu) görünsün */}
      {!isSelectionMode && (
        <Pressable
          style={[styles.fab, { bottom: 30 + insets.bottom }]}
          onPress={() => router.push("/editor")}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  empty: {
    textAlign: "center",
    color: Colors.textMuted,
    marginTop: 40,
    fontSize: 14,
  },
  // === YENİ EKLENEN STİLLER (Header ve İkonlar için) ===
  normalHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textMain,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  // ====================================================

  selectionHeader: {
    backgroundColor: Colors.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cancelText: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  selectedCountText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMain,
  },
  selectionActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMain,
  },
  deleteBtn: {
    backgroundColor: "#FEE2E2",
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
  },
  fab: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "300",
    marginTop: -2,
  },
  dropdownMenu: {
    position: "absolute", // <-- İkon butonuna göre konumlanır
    right: -124, // <-- İkonun sağ hizasından başlar
    top: 48, // <-- İkonun hemen altında belirir
    width: 180,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 999, // <-- Diğer elementlerin üzerinde görünmesini sağlar
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 4,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: "#F1F5F9",
  },
  menuText: {
    fontSize: 14,
    color: Colors.textMain,
  },
  activeMenuText: {
    fontWeight: "600",
    color: Colors.primary,
  },
});

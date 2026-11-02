import { Colors } from "@/constants/colors";
import { authenticateBiometric } from "@/utils/biometric";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteCard } from "../components/NoteCard";
import { NoteCustomHeader } from "../components/NoteCustomHeader";
import NoteLoadingView from "../components/NoteLoadingView";
import { NoteRoundIconButton } from "../components/NoteRoundIconButton";
import { NoteSearchBar } from "../components/NoteSearchBar";
import { NoteWorkspaceModal } from "../components/NoteWorkSpaceModal";
import { useNotesStore } from "../store/useNotesStore";

export function NotesListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const notes = useNotesStore((s) => s.notes);
  const isLoading = useNotesStore((s) => s.isLoading);

  const searchQuery = useNotesStore((s) => s.searchQuery);
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery);

  const sortBy = useNotesStore((s) => s.sortBy);
  const setSortBy = useNotesStore((s) => s.setSortBy);

  const isSortMenuOpen = useNotesStore((s) => s.isSortMenuOpen);
  const toggleSortMenu = useNotesStore((s) => s.toggleSortMenu);
  const closeSortMenu = useNotesStore((s) => s.closeSortMenu);

  const isSearchOpen = useNotesStore((s) => s.isSearchOpen);
  const toggleSearch = useNotesStore((s) => s.toggleSearch);

  const isSelectionMode = useNotesStore((s) => s.isSelectionMode);
  const selectedNoteIds = useNotesStore((s) => s.selectedNoteIds);

  const selectedTagFilter = useNotesStore((s) => s.selectedTagFilter);
  const setSelectedTagFilter = useNotesStore((s) => s.setSelectedTagFilter);

  const toggleSelectNote = useNotesStore((s) => s.toggleSelectNote);
  const selectAllNotes = useNotesStore((s) => s.selectAllNotes);
  const clearSelection = useNotesStore((s) => s.clearSelection);
  const deleteSelectedNotes = useNotesStore((s) => s.deleteSelectedNotes);

  const togglePinNote = useNotesStore((s) => s.togglePinNote);

  const toggleLockNote = useNotesStore((s) => s.toggleLockNote);

  const activeWorkspaceId = useNotesStore((s) => s.activeWorkspaceId);
  const workspaces = useNotesStore((s) => s.workspaces);
  const setActiveWorkspaceId = useNotesStore((s) => s.setActiveWorkspaceId);

  // State eklemesi:
  const [isWorkspaceModalVisible, setIsWorkspaceModalVisible] = useState(false);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  if (isLoading) {
    return <NoteLoadingView />;
  }

  const allUniqueTags = Array.from(
    new Set(notes.flatMap((note) => note.tags || [])),
  );

  const filteredNotes = notes
    .filter((note) => {
      if (note.workspaceId && note.workspaceId !== activeWorkspaceId)
        return false;
      if (!note.workspaceId && activeWorkspaceId !== "default") return false;

      if (note.isLocked) return false;

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query);

      const matchesTag =
        !selectedTagFilter ||
        (note.tags && note.tags.includes(selectedTagFilter));

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (Boolean(b.isPinned) !== Boolean(a.isPinned)) {
        return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
      }
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

  const handleOpenVault = async () => {
    const isAuthenticated = await authenticateBiometric();

    if (isAuthenticated) {
      router.push("/locked-notes"); // Güvenli sayfaya yönlendir
    } else {
      console.log("Doğrulama başarısız.");
    }
  };

  return (
    <View style={styles.container}>
      <NoteCustomHeader
        title="Notlarım"
        rightIcon={
          <Ionicons name="add" size={20} color={Colors.textSecondary} />
        } // 🟢 Doğru (Ionicons bileşeni)
        onRightPress={() => router.push("/editor")}
        leftIcon={
          <Ionicons name="grid-outline" size={18} color={Colors.primary} />
        }
        onLeftPress={() => setIsWorkspaceModalVisible(true)}
      />

      {/* SEÇİM MODU AKTİFSE ÜST BAR */}
      {isSelectionMode ? (
        <View style={[styles.selectionHeader]}>
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
              style={styles.actionBtn}
              onPress={() => {
                selectedNoteIds.forEach((id) => toggleLockNote(id));
                clearSelection();
              }}
            >
              <Text style={styles.actionBtnText}>🔒 Kilitle</Text>
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
        <View style={[styles.normalHeader]}>
          {isSearchOpen ? (
            <View style={styles.searchBarContainer}>
              <NoteSearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <NoteRoundIconButton
                icon={
                  <Ionicons name="close" size={22} color={Colors.textMain} />
                }
                onPress={toggleSearch}
              />
            </View>
          ) : (
            <View style={styles.headerContent}>
              <View style={styles.headerIcons}>
                <NoteRoundIconButton
                  icon={
                    <Ionicons name="search" size={20} color={Colors.textMain} />
                  }
                  onPress={toggleSearch}
                />

                <View style={{ position: "relative" }}>
                  <NoteRoundIconButton
                    icon={
                      <Ionicons
                        name="filter-outline"
                        size={20}
                        color={Colors.textMain}
                      />
                    }
                    onPress={toggleSortMenu}
                  />

                  {/* === SIRALAMA MENÜSÜ === */}
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

                <NoteRoundIconButton
                  icon={
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={Colors.textMain}
                    />
                  }
                  onPress={handleOpenVault}
                />
              </View>
            </View>
          )}
        </View>
      )}

      {/* ETİKET FİLTRELEME ÇUBUĞU */}
      {!isSelectionMode && allUniqueTags.length > 0 && (
        <View style={styles.filterBarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            <Pressable
              style={[
                styles.filterChip,
                selectedTagFilter === null && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedTagFilter(null)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedTagFilter === null && styles.activeFilterChipText,
                ]}
              >
                Tümü
              </Text>
            </Pressable>

            {allUniqueTags.map((tag) => {
              const isSelected = selectedTagFilter === tag;
              return (
                <Pressable
                  key={tag}
                  style={[
                    styles.filterChip,
                    isSelected && styles.activeFilterChip,
                  ]}
                  onPress={() => setSelectedTagFilter(isSelected ? null : tag)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.activeFilterChipText,
                    ]}
                  >
                    #{tag}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Not Listesi */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(n) => n.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: insets.bottom + 90,
            paddingTop: isSelectionMode ? 20 : 12,
          },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>
              {searchQuery || selectedTagFilter
                ? "Aradığınız kritere uygun not bulunamadı."
                : "Henüz not yok. + ile ilk notunu ekle."}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedNoteIds.includes(item.id);
          return (
            <NoteCard
              note={item}
              isSelected={isSelected}
              isSelectionMode={isSelectionMode}
              onPress={() => handleCardPress(item.id)}
              onLongPress={() => toggleSelectNote(item.id)} // Uzun basınca normal seçim modu açılır
              onTogglePin={() => {
                togglePinNote(item.id); // Notu pinler
                clearSelection(); // Seçim modundan çıkar
              }}
            />
          );
        }}
      />

      <NoteWorkspaceModal
        visible={isWorkspaceModalVisible}
        onClose={() => setIsWorkspaceModalVisible(false)}
      />
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
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    color: Colors.textMuted,
    fontSize: 14,
  },
  normalHeader: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 8,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 44,
  },
  headerIcons: {
    flexDirection: "row",
    marginHorizontal: 1,
    width: "100%",
    gap: 8,
  },
  searchBarContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  filterBarContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 4,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMain,
  },
  activeFilterChipText: {
    color: "#FFFFFF",
  },
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
  dropdownMenu: {
    position: "absolute",
    right: -170,
    top: 30,
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
    zIndex: 999,
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

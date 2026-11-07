import { Colors } from "@/constants/colors";
import { authenticateBiometric } from "@/utils/biometric";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteCard } from "../../components/NoteCard";
import { NoteCustomHeader } from "../../components/NoteCustomHeader";
import NoteLoadingView from "../../components/NoteLoadingView";
import { NoteRoundIconButton } from "../../components/NoteRoundIconButton";
import { NoteSearchBar } from "../../components/NoteSearchBar";
import { NoteWorkspaceModal } from "../../components/NoteWorkSpaceModal";
import { useNotes } from "../../store/hooks/useNotes";
import { styles } from "./NotesList.styles";

export function NotesListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    notes,
    isLoading,

    searchQuery,
    setSearchQuery,

    sortBy,
    setSortBy,

    isSortMenuOpen,
    toggleSortMenu,
    closeSortMenu,

    isSearchOpen,
    toggleSearch,

    isSelectionMode,
    selectedNoteIds,

    selectedTagFilter,
    setSelectedTagFilter,

    toggleSelectNote,
    selectAllNotes,
    clearSelection,
    deleteSelectedNotes,

    togglePinNote,
    toggleLockNote,

    activeWorkspaceId,
    workspaces,
    setActiveWorkspaceId,
  } = useNotes();

  // State eklemesi:
  const [isWorkspaceModalVisible, setIsWorkspaceModalVisible] = useState(false);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  // 🔥 Aktif çalışma alanının rengi (Yoksa varsayılan primary)
  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;

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
        title={activeWorkspace?.name || "Notlarım"}
        rightIcon={
          <Ionicons name="add" size={20} color={Colors.textSecondary} />
        }
        onRightPress={() => router.push("/editor")}
        leftIcon={
          <Ionicons name="grid-outline" size={18} color={currentPrimaryColor} />
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
                            sortBy === "en yeniler" && [
                              styles.activeMenuText,
                              { color: currentPrimaryColor },
                            ],
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
                            sortBy === "en eskiler" && [
                              styles.activeMenuText,
                              { color: currentPrimaryColor },
                            ],
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
                            sortBy === "alfabetik" && [
                              styles.activeMenuText,
                              { color: currentPrimaryColor },
                            ],
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
                selectedTagFilter === null && [
                  styles.activeFilterChip,
                  {
                    backgroundColor: currentPrimaryColor,
                    borderColor: currentPrimaryColor,
                  },
                ],
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
                    isSelected && [
                      styles.activeFilterChip,
                      {
                        backgroundColor: currentPrimaryColor,
                        borderColor: currentPrimaryColor,
                      },
                    ],
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
              onLongPress={() => toggleSelectNote(item.id)}
              onTogglePin={() => {
                togglePinNote(item.id);
                clearSelection();
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

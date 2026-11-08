// NotesList/NotesListScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { authenticateBiometric } from "@/utils/biometric";

import { NoteCard } from "../../components/NoteCard";
import { NoteCustomHeader } from "../../components/NoteCustomHeader";
import NoteLoadingView from "../../components/NoteLoadingView";
import { NoteWorkspaceModal } from "./components/NoteWorkSpaceModal";

import { useNotes } from "../../store/hooks/useNotes";
import { useNotesFilter } from "./hooks/useNotesFilter";
import { useNotesSelection } from "./hooks/useNotesSelection";

import { NotesHeader } from "./components/NotesHeader";
import { NotesSelectionBar } from "./components/NotesSelectionBar";
import { NotesTagFilterBar } from "./components/NotesTagFilterBar";

import { useConfirmStore } from "@/store/useConfirmStore";
import { styles } from "./NotesList.styles";

export function NotesListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    notes,
    isLoading,
    sortBy,
    setSortBy,
    isSortMenuOpen,
    toggleSortMenu,
    closeSortMenu,
    selectedNoteIds,
    setSelectedNoteIds,
    toggleSelectNote,
    selectAllNotes,
    clearSelection,
    deleteSelectedNotes,
    togglePinNote,
    toggleLockNote,
    activeWorkspaceId,
    workspaces,
  } = useNotes();

  const [isWorkspaceModalVisible, setIsWorkspaceModalVisible] = useState(false);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentPrimaryColor = activeWorkspace?.color || Colors.primary;

  const { showConfirm } = useConfirmStore();

  // 1. Filtreleme ve Arama Hook'u
  const {
    searchQuery,
    setSearchQuery,
    selectedTagFilter,
    setSelectedTagFilter,
    isSearchOpen,
    toggleSearch,
    allUniqueTags,
    filteredNotes,
  } = useNotesFilter(notes, activeWorkspaceId);

  // 2. Seçim ve Çoklu İşlem Hook'u
  const { isSelectionMode, isAllSelected, handleToggleSelectAll } =
    useNotesSelection(filteredNotes, {
      selectedNoteIds,
      setSelectedNoteIds,
      toggleSelectNote,
      selectAllNotes,
      clearSelection,
      isSelectionMode: useNotes().isSelectionMode,
    });

  if (isLoading) {
    return <NoteLoadingView />;
  }

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
      router.push("/locked-notes");
    } else {
      console.log("Doğrulama başarısız.");
    }
  };

  return (
    <View style={styles.container}>
      <NoteCustomHeader
        title={activeWorkspace?.name || "Notlarım"}
        rightIcon={
          <Ionicons
            name="add"
            size={20}
            color={Colors.textSecondary || Colors.textSecondary}
          />
        }
        onRightPress={() => router.push("/editor")}
        leftIcon={
          <Ionicons name="grid-outline" size={18} color={currentPrimaryColor} />
        }
        onLeftPress={() => setIsWorkspaceModalVisible(true)}
      />

      {/* Üst Arama ve Kontrol Şeridi */}
      {!isSelectionMode && (
        <NotesHeader
          isSearchOpen={isSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSearch={toggleSearch}
          isSortMenuOpen={isSortMenuOpen}
          toggleSortMenu={toggleSortMenu}
          closeSortMenu={closeSortMenu}
          sortBy={sortBy}
          setSortBy={setSortBy}
          currentPrimaryColor={currentPrimaryColor}
          handleOpenVault={handleOpenVault}
          styles={styles}
        />
      )}

      {/* Etiket Filtreleme Çubuğu */}
      {!isSelectionMode && (
        <NotesTagFilterBar
          allUniqueTags={allUniqueTags}
          selectedTagFilter={selectedTagFilter}
          setSelectedTagFilter={setSelectedTagFilter}
          currentPrimaryColor={currentPrimaryColor}
          styles={styles}
        />
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
            paddingTop: 12,
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

      {/* Dinamik Renkli Yüzen Seçim Çubuğu */}
      {isSelectionMode && (
        <NotesSelectionBar
          selectedNoteIds={selectedNoteIds}
          clearSelection={clearSelection}
          isAllSelected={isAllSelected}
          handleToggleSelectAll={handleToggleSelectAll}
          toggleLockNote={toggleLockNote}
          deleteSelectedNotes={() => {
            showConfirm({
              title: "Notları Sil",
              message: "Seçili Notları Silmek İstediğine Emin Misin?",
              onConfirm: deleteSelectedNotes,
            });
          }}
          currentPrimaryColor={currentPrimaryColor}
          bottomInset={insets.bottom}
          styles={styles}
        />
      )}

      <NoteWorkspaceModal
        visible={isWorkspaceModalVisible}
        onClose={() => setIsWorkspaceModalVisible(false)}
      />
    </View>
  );
}

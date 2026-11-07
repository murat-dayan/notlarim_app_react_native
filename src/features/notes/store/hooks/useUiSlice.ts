import { useNotesStore } from "../notesStore";

export function useUiStore() {
  const searchQuery = useNotesStore((s) => s.searchQuery);
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery);

  const selectedNoteIds = useNotesStore((s) => s.selectedNoteIds);
  const isSelectionMode = useNotesStore((s) => s.isSelectionMode);

  const isSearchOpen = useNotesStore((s) => s.isSearchOpen);
  const toggleSearch = useNotesStore((s) => s.toggleSearch);

  const isSortMenuOpen = useNotesStore((s) => s.isSortMenuOpen);
  const toggleSortMenu = useNotesStore((s) => s.toggleSortMenu);
  const closeSortMenu = useNotesStore((s) => s.closeSortMenu);

  const sortBy = useNotesStore((s) => s.sortBy);
  const setSortBy = useNotesStore((s) => s.setSortBy);

  const selectedTagFilter = useNotesStore((s) => s.selectedTagFilter);
  const setSelectedTagFilter = useNotesStore((s) => s.setSelectedTagFilter);

  const toggleSelectNote = useNotesStore((s) => s.toggleSelectNote);
  const selectAllNotes = useNotesStore((s) => s.selectAllNotes);
  const clearSelection = useNotesStore((s) => s.clearSelection);

  const zenDraftContent = useNotesStore((s) => s.zenDraftContent);
  const zenDraftAudioUri = useNotesStore((s) => s.zenDraftAudioUri);
  const zenDraftTodos = useNotesStore((s) => s.zenDraftTodos);
  const setZenDraftContent = useNotesStore((s) => s.setZenDraftContent);

  return {
    searchQuery,
    setSearchQuery,

    selectedNoteIds,
    isSelectionMode,
    toggleSelectNote,
    selectAllNotes,
    clearSelection,

    isSearchOpen,
    toggleSearch,

    isSortMenuOpen,
    toggleSortMenu,
    closeSortMenu,

    sortBy,
    setSortBy,

    selectedTagFilter,
    setSelectedTagFilter,

    zenDraftContent,
    zenDraftAudioUri,
    zenDraftTodos,
    setZenDraftContent,
  };
}

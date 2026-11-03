import { StateCreator } from "zustand";

export type SortType = "en yeniler" | "en eskiler" | "alfabetik";

export type UiSlice = {
  searchQuery: string;
  selectedNoteIds: string[];
  isSelectionMode: boolean;
  isSearchOpen: boolean;
  isSortMenuOpen: boolean;
  sortBy: SortType;
  selectedTagFilter: string | null;
  zenDraftContent: string | null;
  zenDraftAudioUri: string | null; // 🔥 Yeni eklendi

  setSearchQuery: (query: string) => void;
  toggleSelectNote: (id: string) => void;
  selectAllNotes: () => void;
  clearSelection: () => void;
  toggleSearch: () => void;
  toggleSortMenu: () => void;
  closeSortMenu: () => void;
  setSortBy: (sort: SortType) => void;
  setSelectedTagFilter: (tag: string | null) => void;
  setZenDraftContent: (
    content: string | null,
    audioUri?: string | null,
  ) => void; // 🔥 Güncellendi
};

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (
  set,
  get,
) => ({
  searchQuery: "",
  selectedNoteIds: [],
  isSelectionMode: false,
  isSearchOpen: false,
  isSortMenuOpen: false,
  sortBy: "en yeniler",
  selectedTagFilter: null,
  zenDraftContent: null, // Başlangıçta boş
  zenDraftAudioUri: null, // Başlangıçta boş

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleSelectNote: (id) => {
    const { selectedNoteIds, notes } = get() as any; // notes'a store'dan direkt erişiyoruz
    const exists = selectedNoteIds.includes(id);

    let updatedSelection: string[];
    if (exists) {
      updatedSelection = selectedNoteIds.filter((item: string) => item !== id);
    } else {
      updatedSelection = [...selectedNoteIds, id];
    }

    set({
      selectedNoteIds: updatedSelection,
      isSelectionMode: updatedSelection.length > 0,
    });
  },

  selectAllNotes: () => {
    const { notes } = get() as any; // notes'a store'dan direkt erişiyoruz
    const allIds = notes.map((n: any) => n.id);
    set({
      selectedNoteIds: allIds,
      isSelectionMode: true,
    });
  },

  clearSelection: () => {
    set({
      selectedNoteIds: [],
      isSelectionMode: false,
    });
  },

  toggleSearch: () =>
    set((state) => ({
      isSearchOpen: !state.isSearchOpen,
      searchQuery: state.isSearchOpen ? "" : state.searchQuery,
    })),

  toggleSortMenu: () =>
    set((state) => ({ isSortMenuOpen: !state.isSortMenuOpen })),

  closeSortMenu: () => set({ isSortMenuOpen: false }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setSelectedTagFilter: (tag) => set({ selectedTagFilter: tag }),

  setZenDraftContent: (content, audioUri = null) =>
    set({ zenDraftContent: content, zenDraftAudioUri: audioUri }),
});

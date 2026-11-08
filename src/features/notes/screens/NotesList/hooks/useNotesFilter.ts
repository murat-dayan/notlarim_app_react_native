// hooks/useNotesFilter.ts
import { SortType } from "@/features/notes/store/slices/uiSlice";
import { useState } from "react";

export function useNotesFilter(notes: any[], activeWorkspaceId: string) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<SortType>("en yeniler");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) setSearchQuery("");
  };

  const toggleSortMenu = () => setIsSortMenuOpen((prev) => !prev);
  const closeSortMenu = () => setIsSortMenuOpen(false);

  // Benzersiz etiketleri hesapla
  const allUniqueTags = Array.from(
    new Set(notes.flatMap((note) => note.tags || [])),
  );

  // Filtrelenmiş ve sıralanmış notlar
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

  return {
    searchQuery,
    setSearchQuery,
    selectedTagFilter,
    setSelectedTagFilter,
    sortBy,
    setSortBy,
    isSearchOpen,
    toggleSearch,
    isSortMenuOpen,
    toggleSortMenu,
    closeSortMenu,
    allUniqueTags,
    filteredNotes,
  };
}

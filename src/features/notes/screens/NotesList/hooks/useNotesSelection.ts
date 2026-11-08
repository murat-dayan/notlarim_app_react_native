// hooks/useNotesSelection.ts
import { useState } from "react";

export function useNotesSelection(filteredNotes: any[], storeUi: any) {
  const {
    selectedNoteIds,
    setSelectedNoteIds,
    toggleSelectNote,
    selectAllNotes,
    clearSelection,
    isSelectionMode,
  } = storeUi;

  const [previousSelectedIds, setPreviousSelectedIds] = useState<string[]>([]);

  // Tüm filtrelenmiş notlar seçilmiş mi?
  const isAllSelected =
    filteredNotes.length > 0 && selectedNoteIds.length === filteredNotes.length;

  // Tümünü seç / Önceki seçime dön mantığı
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      // Eğer hepsi seçiliyse, toplu seçim öncesi saklanan eski seçimlere geri dön
      setSelectedNoteIds(previousSelectedIds);
    } else {
      // Hepsi seçilmeden hemen önce o anki seçimleri hafızaya al
      setPreviousSelectedIds(selectedNoteIds);
      selectAllNotes(filteredNotes); // Veya mevcut store fonksiyonun
    }
  };

  return {
    isSelectionMode,
    selectedNoteIds,
    toggleSelectNote,
    clearSelection,
    isAllSelected,
    handleToggleSelectAll,
  };
}

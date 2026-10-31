import { create } from "zustand";
import { createNoteSlice, NoteSlice } from "./slices/noteSlice";
import { createUiSlice, UiSlice } from "./slices/uiSlice";

type StoreState = NoteSlice & UiSlice;

export const useNotesStore = create<StoreState>((set, get, store) => {
  const noteSlice = createNoteSlice(set, get, store);
  const uiSlice = createUiSlice(set, get, store);

  return {
    ...noteSlice,
    ...uiSlice,

    // Çoklu silme butonuna basıldığında çalışacak sarmalayıcı fonksiyon:
    deleteSelectedNotes: async () => {
      await noteSlice.deleteSelectedNotes();
      uiSlice.clearSelection();
    },
  };
});

import { create } from "zustand";
import { createNoteSlice, NoteSlice } from "./slices/noteSlice";
import { createUiSlice, UiSlice } from "./slices/uiSlice";
import { createWorkspaceSlice, WorkspaceSlice } from "./slices/workspaceSlice"; // 🔥 1. Import edildi
type StoreState = NoteSlice & UiSlice & WorkspaceSlice;

export const useNotesStore = create<StoreState>((set, get, store) => {
  const noteSlice = createNoteSlice(set, get, store);
  const uiSlice = createUiSlice(set, get, store);
  const workspaceSlice = createWorkspaceSlice(set, get, store);

  return {
    ...noteSlice,
    ...uiSlice,
    ...workspaceSlice,

    // Çoklu silme butonuna basıldığında çalışacak sarmalayıcı fonksiyon:
    deleteSelectedNotes: async () => {
      await noteSlice.deleteSelectedNotes();
      uiSlice.clearSelection();
    },
  };
});

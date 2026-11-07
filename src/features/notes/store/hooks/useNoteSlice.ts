import { useNotesStore } from "../notesStore";

export function useNoteStore() {
  const notes = useNotesStore((s) => s.notes);
  const isLoading = useNotesStore((s) => s.isLoading);

  const loadNotes = useNotesStore((s) => s.loadNotes);
  const addNote = useNotesStore((s) => s.addNote);
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const deleteSelectedNotes = useNotesStore((s) => s.deleteSelectedNotes);

  const togglePinNote = useNotesStore((s) => s.togglePinNote);
  const toggleLockNote = useNotesStore((s) => s.toggleLockNote);

  return {
    notes,
    isLoading,
    loadNotes,
    addNote,
    updateNote,
    deleteNote,
    deleteSelectedNotes,
    togglePinNote,
    toggleLockNote,
  };
}

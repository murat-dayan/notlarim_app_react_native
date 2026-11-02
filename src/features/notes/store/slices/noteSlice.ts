import { StateCreator } from "zustand";
import { notesRepository } from "../../data/notesRepository";
import type { Note } from "../../types";

// Bu dilimin tutacağı state ve fonksiyonların tipleri
export type NoteSlice = {
  notes: Note[];
  isLoading: boolean;
  loadNotes: () => Promise<void>;
  addNote: (title: string, content: string, tags: string[]) => Promise<void>;
  updateNote: (
    id: string,
    title: string,
    content: string,
    tags: string[],
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  deleteSelectedNotes: () => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;
  toggleLockNote: (id: string) => Promise<void>; // 🔥 Yeni eklendi
};

export const createNoteSlice: StateCreator<NoteSlice, [], [], NoteSlice> = (
  set,
  get,
) => ({
  notes: [],
  isLoading: true,

  loadNotes: async () => {
    const notes = await notesRepository.getAll();
    set({ notes, isLoading: false });
  },

  addNote: async (title, content, tags) => {
    const now = Date.now();
    const activeWorkspaceId = (get() as any).activeWorkspaceId || "default"; // 🔥 Aktif çalışma alanını alıyoruz
    const yeniNot: Note = {
      id: now.toString(),
      title,
      content,
      tags,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      isLocked: false,
      workspaceId: activeWorkspaceId,
    };

    await notesRepository.insert(yeniNot);
    set((state) => ({ notes: [yeniNot, ...state.notes] }));
  },

  updateNote: async (id, title, content, tags) => {
    const eski = get().notes.find((n) => n.id === id);
    if (!eski) return;

    const guncel: Note = {
      ...eski,
      title,
      content,
      tags,
      updatedAt: Date.now(),
    };
    await notesRepository.update(guncel);

    set((state) => ({
      notes: [guncel, ...state.notes.filter((n) => n.id !== id)],
    }));
  },

  deleteNote: async (id) => {
    await notesRepository.remove(id);
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
  },

  deleteSelectedNotes: async () => {
    // uiSlice'tan gelen selectedNoteIds'e doğrudan get() ile ulaşıyoruz
    const { selectedNoteIds } = get() as any;
    if (!selectedNoteIds || selectedNoteIds.length === 0) return;

    await notesRepository.removeMany(selectedNoteIds);
    set((state) => ({
      notes: state.notes.filter((n) => !selectedNoteIds.includes(n.id)),
    }));
  },

  togglePinNote: async (id: string) => {
    const hedefNot = get().notes.find((n) => n.id === id);
    if (!hedefNot) return;

    const yeniPinDurumu = !hedefNot.isPinned;

    // Veritabanını güncelle
    await notesRepository.togglePin(id, yeniPinDurumu);

    // State'i güncelle
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isPinned: yeniPinDurumu } : n,
      ),
    }));
  },

  toggleLockNote: async (id: string) => {
    const hedefNot = get().notes.find((n) => n.id === id);
    if (!hedefNot) return;

    const yeniKilitDurumu = !hedefNot.isLocked;

    // Veritabanını güncelle
    await notesRepository.toggleLock(id, yeniKilitDurumu);

    // State'i güncelle
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isLocked: yeniKilitDurumu } : n,
      ),
    }));
  },
});

import { Note, TodoItem } from "../types";
import { getDb } from "./database";
import { todosRepository } from "./todosRepository";

type NoteRow = {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  created_at: number;
  updated_at: number;
  is_pinned: number;
  is_locked: number;
  workspace_id: string;
  audio_uri: string | null;
  latitude: number | null;
  longitude: number | null;
};

const toNote = (row: NoteRow, todos: TodoItem[] = []): Note => ({
  id: row.id,
  title: row.title,
  content: row.content,
  tags: row.tags ? JSON.parse(row.tags) : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  isPinned: Boolean(row.is_pinned),
  isLocked: Boolean(row.is_locked),
  workspaceId: row.workspace_id || "default",
  audioUri: row.audio_uri || undefined,
  latitude: row.latitude ?? undefined,
  longitude: row.longitude ?? undefined,
  todos,
});

export const notesRepository = {
  async getAll(): Promise<Note[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<NoteRow>(
      "SELECT * FROM notes ORDER BY is_pinned DESC, updated_at DESC",
    );
    const todoMap = await todosRepository.getAllGroupedByNote();

    return rows.map((row) => toNote(row, todoMap.get(row.id) ?? []));
  },

  async insert(note: Note): Promise<void> {
    const db = await getDb();
    const tagsJson = JSON.stringify(note.tags || []); // Diziyi JSON metnine çeviriyoruz

    await db.runAsync(
      "INSERT INTO notes (id, title, content, tags, created_at,updated_at , is_pinned, is_locked, workspace_id, audio_uri, latitude,longitude) VALUES (?,?,?,?,?, ?, ?, ?, ?, ?,?,?)",
      [
        note.id,
        note.title,
        note.content,
        tagsJson,
        note.createdAt,
        note.updatedAt,
        note.isPinned ? 1 : 0,
        note.isLocked ? 1 : 0,
        note.workspaceId || "default",
        note.audioUri || null,
        note.latitude || null,
        note.longitude || null,
      ],
    );
    if (note.todos && note.todos.length > 0) {
      await todosRepository.replaceForNote(note.id, note.todos);
    }
  },

  async update(note: Note): Promise<void> {
    const db = await getDb();
    const tagsJson = JSON.stringify(note.tags || []);

    await db.runAsync(
      "UPDATE notes SET title = ?, content = ?, tags = ?, updated_at = ?, workspace_id = ?, audio_uri = ?, latitude = ?, longitude = ? WHERE id = ?",
      [
        note.title,
        note.content,
        tagsJson,
        note.updatedAt,
        note.workspaceId,
        note.audioUri || null,
        note.latitude || null, // 7. parametre (latitude)
        note.longitude || null, // 8. parametre (longitude)
        note.id, // 9. parametre (WHERE id için)
      ],
    );
    if (note.todos) {
      await todosRepository.replaceForNote(note.id, note.todos);
    }
  },

  async remove(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
  },

  async removeMany(ids: string[]): Promise<void> {
    if (ids?.length === 0) return;
    const db = await getDb();
    const placeholders = ids.map(() => "?").join(",");
    await db.runAsync(`DELETE FROM notes WHERE id IN (${placeholders})`, ids);
  },

  async togglePin(id: string, isPinned: boolean) {
    const db = await getDb();
    await db.runAsync(
      "UPDATE notes SET is_pinned = ? WHERE id = ?",
      isPinned ? 1 : 0,
      id,
    );
  },

  async toggleLock(id: string, isLocked: boolean) {
    const db = await getDb();
    await db.runAsync(
      "UPDATE notes SET is_locked = ? WHERE id = ?",
      isLocked ? 1 : 0,
      id,
    );
  },
};

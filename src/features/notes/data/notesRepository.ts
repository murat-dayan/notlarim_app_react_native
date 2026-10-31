import { Note } from "../types";
import { getDb } from "./database";

type NoteRow = {
  id: string;
  title: string;
  content: string;
  created_at: number;
  updated_at: number;
};

const toNote = (row: NoteRow): Note => ({
  id: row.id,
  title: row.title,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const notesRepository = {
  async getAll(): Promise<Note[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<NoteRow>(
      "SELECT*FROM notes ORDER BY updated_at DESC",
    );
    return rows.map(toNote);
  },

  async insert(note: Note): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [note.id, note.title, note.content, note.createdAt, note.updatedAt],
    );
  },

  async update(note: Note): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?",
      [note.title, note.content, note.updatedAt, note.id],
    );
  },

  async remove(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
  },

  async removeMany(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const db = await getDb();

    const placeholders = ids.map(() => "?").join(",");

    await db.runAsync(`DELETE FROM notes WHERE id IN (${placeholders})`, ids);
  },
};

import { TodoItem } from "../types";
import { getDb } from "./database";

type TodoRow = {
  id: string;
  note_id: string;
  text: string;
  done: number;
  position: number;
  created_at: number;
};

const toTodo = (row: TodoRow): TodoItem => ({
  id: row.id,
  text: row.text,
  done: Boolean(row.done),
});

export const todosRepository = {
  // Tüm yapılacakları tek sorguda çekip not id'sine göre gruplar
  async getAllGroupedByNote(): Promise<Map<string, TodoItem[]>> {
    const db = await getDb();
    const rows = await db.getAllAsync<TodoRow>(
      "SELECT * FROM todos ORDER BY position ASC",
    );

    const map = new Map<string, TodoItem[]>();
    for (const row of rows) {
      const list = map.get(row.note_id) ?? [];
      list.push(toTodo(row));
      map.set(row.note_id, list);
    }
    return map;
  },

  // Bir notun yapılacaklarını tek transaction'da yeniden yazar
  async replaceForNote(noteId: string, todos: TodoItem[]): Promise<void> {
    const db = await getDb();
    await db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM todos WHERE note_id = ?", [noteId]);

      const now = Date.now();
      for (let i = 0; i < todos.length; i++) {
        const t = todos[i];
        await db.runAsync(
          "INSERT INTO todos (id, note_id, text, done, position, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          [t.id, noteId, t.text, t.done ? 1 : 0, i, now],
        );
      }
    });
  },
};

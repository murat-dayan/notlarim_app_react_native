import { Workspace } from "../types";
import { getDb } from "./database";

type WorkspaceRow = {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: number;
};

const toWorkspace = (row: WorkspaceRow): Workspace => ({
  id: row.id,
  name: row.name,
  color: row.color,
  icon: row.icon,
  createdAt: row.created_at,
});

export const workspacesRepository = {
  async getAll(): Promise<Workspace[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<WorkspaceRow>(
      "SELECT * FROM workspaces ORDER BY created_at ASC",
    );
    return rows.map(toWorkspace);
  },

  async insert(workspace: Workspace): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "INSERT INTO workspaces (id, name, color, icon, created_at) VALUES (?, ?, ?, ?, ?)",
      [
        workspace.id,
        workspace.name,
        workspace.color,
        workspace.icon,
        workspace.createdAt,
      ],
    );
  },

  async remove(id: string): Promise<void> {
    const db = await getDb();
    // Not: Veritabanında ON DELETE CASCADE tanımladığımız için bu çalışma alanına ait notlar da otomatik silinecektir.
    await db.runAsync("DELETE FROM workspaces WHERE id = ?", [id]);
  },
};

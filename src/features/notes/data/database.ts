import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("notlarim.db");

      // 1. Temel Tabloyu Oluştur (Eğer hiç yoksa)
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);

      // 2. Migration Kontrolü: 'tags' sütunu var mı? Yoksa güvenli bir şekilde ekle!
      try {
        // Tablodaki sütunları kontrol etmek için PRAGMA kullanıyoruz
        const tableInfo = await db.getAllAsync<{ name: string }>(
          "PRAGMA table_info(notes)",
        );

        const hasTagsColumn = tableInfo.some((col) => col.name === "tags");

        if (!hasTagsColumn) {
          // Eğer tags sütunu yoksa verileri silmeden sütunu tabloya ekliyoruz
          await db.execAsync("ALTER TABLE notes ADD COLUMN tags TEXT;");
          console.log("Migration başarılı: 'tags' sütunu eklendi.");
        }
      } catch (error) {
        console.error("Migration hatası:", error);
      }

      try {
        const tableInfo = await db.getAllAsync<{ name: string }>(
          "PRAGMA table_info(notes)",
        );

        const hasPinnedColumn = tableInfo.some(
          (col) => col.name === "is_pinned",
        );

        if (!hasPinnedColumn) {
          // Varsayılan olarak 0 (sabitlenmemiş) atanır
          await db.execAsync(
            "ALTER TABLE notes ADD COLUMN is_pinned INTEGER DEFAULT 0;",
          );
          console.log("Migration başarılı: 'is_pinned' sütunu eklendi.");
        }
      } catch (error) {
        console.error("Migration hatası (is_pinned):", error);
      }

      try {
        const tableInfo = await db.getAllAsync<{ name: string }>(
          "PRAGMA table_info(notes)",
        );

        const hasLockedColumn = tableInfo.some(
          (col) => col.name === "is_locked",
        );

        if (!hasLockedColumn) {
          await db.execAsync(
            "ALTER TABLE notes ADD COLUMN is_locked INTEGER DEFAULT 0;",
          );
          console.log("Migration başarılı: 'is_locked' sütunu eklendi.");
        }
      } catch (error) {
        console.error("Migration hatası (is_locked):", error);
      }

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS workspaces (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          icon TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );
      `);

      const existingWorkspaces = await db.getAllAsync(
        "SELECT id FROM workspaces",
      );
      if (existingWorkspaces.length === 0) {
        await db.runAsync(
          "INSERT INTO workspaces (id, name, color, icon, created_at) VALUES (?, ?, ?, ?, ?)",
          ["default", "Kişisel", "#3b82f6", "person-outline", Date.now()],
        );
        console.log("Varsayılan çalışma alanı oluşturuldu: Kişisel");
      }

      // 2. Migration: 'notes' tablosuna 'workspace_id' sütununu ekle
      try {
        const tableInfo = await db.getAllAsync<{ name: string }>(
          "PRAGMA table_info(notes)",
        );

        const hasWorkspaceIdColumn = tableInfo.some(
          (col) => col.name === "workspace_id",
        );

        if (!hasWorkspaceIdColumn) {
          // Var olan eski notları "default" çalışma alanına bağlayarak ekliyoruz
          await db.execAsync(
            "ALTER TABLE notes ADD COLUMN workspace_id TEXT DEFAULT 'default';",
          );
          console.log("Migration başarılı: 'workspace_id' sütunu eklendi.");
        }
      } catch (error) {
        console.error("Migration hatası (workspace_id):", error);
      }

      return db;
    })();
  }
  return dbPromise;
}

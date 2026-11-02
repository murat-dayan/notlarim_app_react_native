import { StateCreator } from "zustand";
import { workspacesRepository } from "../../data/workspacesRepository";
import type { Workspace } from "../../types";

export type WorkspaceSlice = {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  loadWorkspaces: () => Promise<void>;
  setActiveWorkspaceId: (id: string) => void;
  addWorkspace: (name: string, color: string, icon: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
};

export const createWorkspaceSlice: StateCreator<any, [], [], WorkspaceSlice> = (
  set,
  get,
) => ({
  workspaces: [],
  activeWorkspaceId: "default", // Varsayılan "Kişisel" çalışma alanı ID'si

  loadWorkspaces: async () => {
    const workspaces = await workspacesRepository.getAll();
    set({ workspaces });

    // Eğer aktif olan workspace listede yoksa güvenli bir şekilde ilkini seç
    if (
      workspaces.length > 0 &&
      !workspaces.some((w) => w.id === get().activeWorkspaceId)
    ) {
      set({ activeWorkspaceId: workspaces[0].id });
    }
  },

  setActiveWorkspaceId: (id: string) => {
    set({ activeWorkspaceId: id });
  },

  addWorkspace: async (name, color, icon) => {
    const now = Date.now();
    const newWorkspace: Workspace = {
      id: now.toString(),
      name,
      color,
      icon,
      createdAt: now,
    };

    await workspacesRepository.insert(newWorkspace);
    set((state: any) => ({ workspaces: [...state.workspaces, newWorkspace] }));
  },

  deleteWorkspace: async (id) => {
    // Son çalışma alanının silinmesini önlemek için güvenlik kontrolü
    if (get().workspaces.length <= 1) return;

    await workspacesRepository.remove(id);

    set((state: any) => {
      const updatedWorkspaces = state.workspaces.filter(
        (w: Workspace) => w.id !== id,
      );
      let newActiveId = state.activeWorkspaceId;

      // Eğer silinen çalışma alanı şu an seçili olanse, ilkine geçiş yap
      if (state.activeWorkspaceId === id && updatedWorkspaces.length > 0) {
        newActiveId = updatedWorkspaces[0].id;
      }

      return {
        workspaces: updatedWorkspaces,
        activeWorkspaceId: newActiveId,
      };
    });
  },
});

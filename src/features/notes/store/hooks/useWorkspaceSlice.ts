import { useNotesStore } from "../notesStore";

export function useWorkspaceStore() {
  const workspaces = useNotesStore((s) => s.workspaces);
  const activeWorkspaceId = useNotesStore((s) => s.activeWorkspaceId);

  const loadWorkspaces = useNotesStore((s) => s.loadWorkspaces);
  const setActiveWorkspaceId = useNotesStore((s) => s.setActiveWorkspaceId);

  const addWorkspace = useNotesStore((s) => s.addWorkspace);
  const deleteWorkspace = useNotesStore((s) => s.deleteWorkspace);

  return {
    workspaces,
    activeWorkspaceId,
    loadWorkspaces,
    setActiveWorkspaceId,
    addWorkspace,
    deleteWorkspace,
  };
}

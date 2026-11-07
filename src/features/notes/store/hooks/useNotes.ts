import { useNoteStore } from "./useNoteSlice";
import { useUiStore } from "./useUiSlice";
import { useWorkspaceStore } from "./useWorkspaceSlice";

export function useNotes() {
  const note = useNoteStore();
  const ui = useUiStore();
  const workspace = useWorkspaceStore();

  return {
    ...note,
    ...ui,
    ...workspace,
  };
}

import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  tagsSection: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    marginBottom: 6,
  },
  inlineAudioContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  audioHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  audioLabelText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingVertical: 4,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTagChip: {},
  tagText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textMain,
  },
  selectedTagText: {
    color: "#FFFFFF",
  },
  addTagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  addTagText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  customTagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    paddingLeft: 10,
    overflow: "hidden",
  },
  customTagInput: {
    fontSize: 13,
    color: Colors.textMain,
    paddingVertical: 4,
    width: 90,
  },
  addTagConfirmBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addTagConfirmText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  editorHeaderMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // ✅ Salt okunur & Checkbox yapılabilir todo kartı stilleri
  readOnlyTodoCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  readOnlyTodoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  readOnlyTodoTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  readOnlyTodoCounter: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  readOnlyTodoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  todoCheck: {
    padding: 2,
  },
  readOnlyTodoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain,
  },
  readOnlyTodoTextDone: {
    textDecorationLine: "line-through",
    color: Colors.textMuted,
  },
  editorToolbar: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    marginTop: 8,
  },
  toolbarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toolbarButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMain,
  },
});

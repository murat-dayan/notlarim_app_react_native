import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    color: Colors.textMuted,
    fontSize: 14,
  },
  normalHeader: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 8,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 44,
  },
  headerIcons: {
    flexDirection: "row",
    marginHorizontal: 1,
    width: "100%",
    gap: 8,
  },
  searchBarContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  filterBarContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 4,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeFilterChip: {},
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMain,
  },
  activeFilterChipText: {
    color: "#FFFFFF",
  },
  selectionHeader: {
    backgroundColor: Colors.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cancelText: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  selectedCountText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMain,
  },
  selectionActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMain,
  },
  deleteBtn: {
    backgroundColor: "#FEE2E2",
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
  },
  dropdownMenu: {
    position: "absolute",
    right: -170,
    top: 30,
    width: 180,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 999,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 4,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: "#F1F5F9",
  },
  menuText: {
    fontSize: 14,
    color: Colors.textMain,
  },
  activeMenuText: {
    fontWeight: "600",
    color: Colors.primary,
  },
});

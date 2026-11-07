import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listContainer: { paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
});

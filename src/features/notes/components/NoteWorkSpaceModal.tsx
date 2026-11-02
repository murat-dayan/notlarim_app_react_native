import { Colors } from "@/constants/colors";
import { useNotesStore } from "@/features/notes/store/useNotesStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

// 🔥 Seçilebilir renk paleti
const PRESET_COLORS = [
  "#6366F1", // İndigo (Varsayılan)
  "#EF4444", // Kırmızı (İş vb.)
  "#10B981", // Yeşil (Finans/Doğa)
  "#F59E0B", // Turuncu/Sarı
  "#8B5CF6", // Mor
  "#EC4899", // Pembe
];

export function NoteWorkspaceModal({ visible, onClose }: Props) {
  const workspaces = useNotesStore((s) => s.workspaces);
  const activeWorkspaceId = useNotesStore((s) => s.activeWorkspaceId);
  const setActiveWorkspaceId = useNotesStore((s) => s.setActiveWorkspaceId);
  const addWorkspace = useNotesStore((s) => s.addWorkspace);
  const deleteWorkspace = useNotesStore((s) => s.deleteWorkspace);

  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]); // 🔥 Seçilen renk

  const handleCreate = async () => {
    if (!newWorkspaceName.trim()) return;

    // 🔥 Seçilen rengi ve ikonu store'a net bir şekilde gönderiyoruz
    await addWorkspace(
      newWorkspaceName.trim(),
      selectedColor,
      "folder-outline",
    );

    setNewWorkspaceName("");
    setSelectedColor(PRESET_COLORS[0]);
    setIsCreating(false);
    onClose(); // Ekledikten sonra modalı kapatabiliriz
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Çalışma Alanları</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.textMain} />
            </Pressable>
          </View>

          {/* Liste */}
          <View style={styles.list}>
            {workspaces.map((workspace) => {
              const isActive = workspace.id === activeWorkspaceId;
              const workspaceColor = workspace.color || Colors.primary;

              return (
                <Pressable
                  key={workspace.id}
                  style={[
                    styles.workspaceItem,
                    isActive && {
                      backgroundColor: `${workspaceColor}10`,
                      borderColor: workspaceColor,
                    },
                  ]}
                  onPress={() => {
                    setActiveWorkspaceId(workspace.id);
                    onClose();
                  }}
                >
                  <View style={styles.workspaceInfo}>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: workspaceColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.workspaceText,
                        isActive && {
                          color: workspaceColor,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {workspace.name}
                    </Text>
                  </View>

                  <View style={styles.itemRight}>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={workspaceColor}
                      />
                    )}
                    {workspaces.length > 1 && (
                      <Pressable
                        onPress={() => deleteWorkspace(workspace.id)}
                        style={styles.deleteIcon}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#EF4444"
                        />
                      </Pressable>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Yeni Workspace Ekleme Alanı */}
          {isCreating ? (
            <View style={styles.createContainer}>
              <TextInput
                style={styles.input}
                placeholder="Çalışma Alanı Adı (Örn: İş, Proje)"
                placeholderTextColor={Colors.textMuted}
                value={newWorkspaceName}
                onChangeText={setNewWorkspaceName}
                autoFocus
              />

              {/* Renk Seçim Paleti */}
              <View style={styles.colorPickerContainer}>
                <Text style={styles.colorPickerLabel}>Renk Seç:</Text>
                <View style={styles.colorRow}>
                  {PRESET_COLORS.map((color) => (
                    <Pressable
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColorOption,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.createActions}>
                <Pressable
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setIsCreating(false)}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.saveButton,
                    { backgroundColor: selectedColor },
                  ]}
                  onPress={handleCreate}
                >
                  <Text style={styles.saveButtonText}>Ekle</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={styles.addButton}
              onPress={() => setIsCreating(true)}
            >
              <Ionicons name="add" size={18} color={Colors.primary} />
              <Text style={styles.addButtonText}>Yeni Çalışma Alanı Ekle</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textMain,
  },
  list: {
    gap: 8,
    marginBottom: 16,
  },
  workspaceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  workspaceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  workspaceText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textMain,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteIcon: {
    padding: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    backgroundColor: "#EFF6FF",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  createContainer: {
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textMain,
  },
  colorPickerContainer: {
    gap: 6,
  },
  colorPickerLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textMuted,
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColorOption: {
    borderColor: "#1E293B",
    transform: [{ scale: 1.1 }],
  },
  createActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#E2E8F0",
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMain,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

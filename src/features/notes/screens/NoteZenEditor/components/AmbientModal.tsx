// features/notes/components/AmbientModal.tsx
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SoundKey } from "../hooks/useAmbientSound";

type AmbientModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectSound: (key: SoundKey) => void;
  currentSoundKey: SoundKey | null;
  onStop: () => void;
};

const AMBIENT_OPTIONS: {
  key: SoundKey;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "rain", title: "Pencere Önü Yağmur", icon: "rainy-outline" },
  { key: "fireplace", title: "Şömine Çıtırtısı", icon: "flame-outline" },
  { key: "cafe", title: "Hafif Kafe Uğultusu", icon: "cafe-outline" },
];

export function AmbientModal({
  visible,
  onClose,
  onSelectSound,
  currentSoundKey,
  onStop,
}: AmbientModalProps) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>Odak Ambiyans Sesleri</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Ses Listesi */}
              <View style={styles.list}>
                {AMBIENT_OPTIONS.map((item) => {
                  const isSelected = currentSoundKey === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.optionButton,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() => {
                        onSelectSound(item.key);
                        onClose(); // İstediğin gibi seçilince modal kapanıyor
                      }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={isSelected ? "#6366F1" : "#475569"}
                      />
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedText,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Eğer çalan bir ses varsa durdurma butonu koyalım */}
              {currentSoundKey && (
                <TouchableOpacity style={styles.stopButton} onPress={onStop}>
                  <Ionicons
                    name="stop-circle-outline"
                    size={18}
                    color="#EF4444"
                  />
                  <Text style={styles.stopText}>Çalan Sesi Durdur</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end", // Alttan açılan modal hissi
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  list: {
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
  },
  selectedOption: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  selectedText: {
    color: "#4F46E5",
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
  },
  stopText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
  },
});

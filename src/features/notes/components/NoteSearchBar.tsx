import { Colors } from "@/constants/colors";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function NoteSearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Notlarda ara..."
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="while-editing" // iOS için temizleme butonu
      />
      {value.length > 0 && (
        <Pressable style={styles.clearButton} onPress={() => onChangeText("")}>
          <Text style={styles.clearButtonText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 12,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 45, // Çarpı butonuna yer bırakmak için sağdan boşluk
    fontSize: 15,
    color: Colors.textMain,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  clearButton: {
    position: "absolute",
    right: 28,
    top: "50%", // <-- Kutunun tam tepesinden %50 aşağı indirir
    marginTop: -12, // <-- Butonun kendi yüksekliğinin (24px) yarısı kadar yukarı kaydırarak mükemmel ortalar
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "bold",
  },
});

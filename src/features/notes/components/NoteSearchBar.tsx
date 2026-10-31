import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { NoteRoundIconButton } from "./NoteRoundIconButton";

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
        <NoteRoundIconButton
          icon={<Ionicons name="close" />}
          onPress={() => onChangeText("")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔥 Ekrandaki tüm boş alanı kaplasın
    position: "relative",
    justifyContent: "center",
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 45, // Sağdaki buton için boşluk
    fontSize: 15,
    color: Colors.textMain,
  },
  iconContainer: {
    position: "absolute",
    right: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

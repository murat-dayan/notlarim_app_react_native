import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NoteText } from "./NoteText";

type CustomHeaderProps = {
  title: string;
  onRightPress?: () => void; // Sağ üstteki buton için (örn: Arama veya Ekle)
  rightIcon?: string;
};

export function NoteCustomHeader({
  title,
  onRightPress,
  rightIcon,
}: CustomHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <NoteText variant="h1" fontFamily="BuildStorm">
        {title}{" "}
      </NoteText>

      {rightIcon && (
        <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
          <Text style={styles.iconText}>{rightIcon}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60, // Telefonun çentiği (notch/dynamic island) için üst boşluk
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800", // Çok modern, kalın bir başlık
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 18,
  },
});

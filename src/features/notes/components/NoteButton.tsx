import { Colors } from "@/constants/colors";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant: "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function NoteButton({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.baseButton,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        style,
      ]}
    >
      <Text
        style={[
          styles.baseText,
          isPrimary ? styles.primaryText : styles.secondaryText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  baseText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // 1. Seçenek: Primary (Dolgulu / Renkli)
  primaryButton: {
    backgroundColor: Colors.primary, // Kendi ana rengini buraya yazabilirsin
  },
  primaryText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  // 2. Seçenek: Secondary (Çerçeveli / Sade)
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.secondary, // Ana rengin çerçevesi
  },
  secondaryText: {
    color: Colors.textMain,
    fontSize: 16,
    fontWeight: "600",
  },
});

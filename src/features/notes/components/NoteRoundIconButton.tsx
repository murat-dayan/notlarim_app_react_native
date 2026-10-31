import React from "react"; // React'i import ettiğinden emin ol
import { Pressable, StyleSheet, ViewStyle } from "react-native";

type IconButtonProps = {
  icon: React.ReactNode; // 🔥 Artık hem metin emoji hem de Ionicons gibi bileşenler alabilir!
  onPress?: () => void;
  style?: ViewStyle;
};

export function NoteRoundIconButton({ icon, onPress, style }: IconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconButton,
        pressed && styles.pressedButton,
        style,
      ]}
      onPress={onPress}
    >
      {/* Doğrudan React Node olarak render ediyoruz */}
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12, // veya daire için 20
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pressedButton: {
    transform: [{ scale: 0.95 }],
    backgroundColor: "#F1F5F9",
  },
});

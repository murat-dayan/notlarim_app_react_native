import { StyleSheet, Text, TextProps } from "react-native";

type TextVariant = "h1" | "h2" | "body" | "caption" | "button";

// 🔥 Burada tırnak açtığında çıkmasını istediğin seçenekleri listeliyoruz
type FontFamilyOption = "BuildStorm" | "Aladin" | "Amarante" | "system";

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  weight?: "400" | "500" | "600" | "700" | "800";
  italic?: boolean;
  fontFamily?: FontFamilyOption; // Artık tırnak açınca otomatik seçenek çıkacak!
}

export function NoteText({
  children,
  variant = "body",
  color,
  italic = false,
  fontFamily,
  style,
  ...props
}: AppTextProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "h1":
        return styles.h1;
      case "h2":
        return styles.h2;
      case "body":
        return styles.body;
      case "caption":
        return styles.caption;
      case "button":
        return styles.button;
      default:
        return styles.body;
    }
  };

  // 🔥 Hangi fontun seçildiğini kontrol ediyoruz
  const getFontFamilyStyle = () => {
    if (fontFamily === "BuildStorm") return "BuildStorm";
    if (fontFamily === "Aladin") return "Aladin";
    if (fontFamily === "Amarante") return "Amarante";
    return undefined; // "system" veya undefined durumunda sistem fontu kullanılır
  };

  const finalFontFamily = getFontFamilyStyle();

  return (
    <Text
      style={[
        getVariantStyle(),
        finalFontFamily ? { fontFamily: finalFontFamily } : null,
        color ? { color } : null,
        italic ? { fontStyle: "italic" } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 26, color: "#0f172a", letterSpacing: -0.5 },
  h2: { fontSize: 17, color: "#0f172a", letterSpacing: -0.2 },
  body: { fontSize: 14, color: "#475569", lineHeight: 21 },
  caption: { fontSize: 12, color: "#94a3b8" },
  button: { fontSize: 16, color: "#ffffff" },
});
